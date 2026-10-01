const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;
const Contribution = require('../models/Contribution');
const Site = require('../models/Site');
const auth = require('../middleware/auth');
const { getCoordinatesForLocation } = require('../utils/geoLookup');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
    'video/mp4', 'video/webm', 'video/quicktime'
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP, MP4, WebM, and MOV files are allowed'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

const uploadToCloudinary = (file) => new Promise((resolve, reject) => {
  const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'image';
  const stream = cloudinary.uploader.upload_stream({
    folder: 'heritagewalk/contributions',
    resource_type: resourceType
  }, (error, result) => {
    if (error) return reject(error);
    resolve({ url: result.secure_url, resourceType });
  });

  Readable.from(file.buffer).pipe(stream);
});

// POST /api/contributions - Create a contribution
router.post('/', auth, upload.array('photos', 5), async (req, res, next) => {
  try {
    const {
      siteId,
      siteName,
      siteType,
      siteCity,
      siteState,
      type,
      content,
      isVerified
    } = req.body;

    // Convert content to clean string safely
    let contentStr = '';
    if (Array.isArray(content)) {
      contentStr = content.filter(Boolean).join('\n\n');
    } else if (typeof content === 'string') {
      contentStr = content.trim();
    }

    if (req.files?.length && (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET)) {
      return res.status(503).json({
        error: { message: 'Cloudinary is not configured. Set the Cloudinary environment variables to upload media.' }
      });
    }

    const uploadedMedia = await Promise.all((req.files || []).map(uploadToCloudinary));
    const contributionData = {
      type: type || 'photo',
      contributor: {
        name: req.user.name,
        email: req.user.email
      },
      content: contentStr,
      isVerified: isVerified === 'true' || isVerified === true,
      photos: uploadedMedia.filter(media => media.resourceType === 'image').map(media => media.url),
      videos: uploadedMedia.filter(media => media.resourceType === 'video').map(media => media.url)
    };

    if (siteId && siteId !== 'new') {
      contributionData.siteId = siteId;
    }
    if (siteName) {
      contributionData.siteName = siteName;
    }
    if (siteType) {
      contributionData.siteType = siteType;
    }
    if (siteCity || siteState) {
      contributionData.siteLocation = {
        city: siteCity || 'India',
        state: siteState || 'Gujarat'
      };
    }

    const contribution = new Contribution(contributionData);
    await contribution.save();

    // Increment site contribution count if existing site
    if (contributionData.siteId) {
      await Site.findByIdAndUpdate(contributionData.siteId, {
        $inc: { contributionCount: 1 }
      });
    }

    res.status(201).json({
      message: 'Thank you! Your contribution has been submitted for review.',
      contribution
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
});

// GET /api/contributions/mine - Get the authenticated user's contributions
router.get('/mine', auth, async (req, res, next) => {
  try {
    const contributions = await Contribution.find({ 'contributor.email': req.user.email })
      .populate('siteId', 'name slug')
      .sort({ createdAt: -1 });

    res.json({ contributions });
  } catch (err) {
    next(err);
  }
});

// GET /api/contributions - Get all contributions with optional email filter
router.get('/', async (req, res, next) => {
  try {
    const { status, type, email, contributorEmail } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (type) {
      filter.type = type;
    }

    const userEmail = email || contributorEmail;
    if (userEmail) {
      filter['contributor.email'] = new RegExp(`^${userEmail.trim()}$`, 'i');
    }

    const contributions = await Contribution.find(filter)
      .populate('siteId', 'name slug')
      .sort({ createdAt: -1 });

    // Get counts by status
    const [pendingCount, approvedCount, rejectedCount, totalCount] = await Promise.all([
      Contribution.countDocuments({ status: 'pending' }),
      Contribution.countDocuments({ status: 'approved' }),
      Contribution.countDocuments({ status: 'rejected' }),
      Contribution.countDocuments({})
    ]);

    res.json({
      contributions,
      counts: {
        all: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/contributions/:id - Get single contribution
router.get('/:id', async (req, res, next) => {
  try {
    const contribution = await Contribution.findById(req.params.id)
      .populate('siteId', 'name slug');
    if (!contribution) {
      return res.status(404).json({ error: { message: 'Contribution not found' } });
    }
    res.json(contribution);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/contributions/:id/review - Review a contribution
router.patch('/:id/review', async (req, res, next) => {
  try {
    const { status, reviewNote } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: { message: 'Status must be "approved" or "rejected"' } });
    }

    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) {
      return res.status(404).json({ error: { message: 'Contribution not found' } });
    }

    contribution.status = status;
    if (reviewNote) contribution.reviewNote = reviewNote;

    // IF APPROVED AND IT'S A NEW SITE: Create the new Site record in MongoDB!
    if (status === 'approved' && contribution.type === 'new_site' && contribution.siteName) {
      // Check if site already exists by slug/name
      const generatedSlug = contribution.siteName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      let existingSite = await Site.findOne({ slug: generatedSlug });

      if (!existingSite) {
        const photoEntries = contribution.photos.length > 0
          ? contribution.photos.map((url, idx) => ({
              url,
              caption: `${contribution.siteName} view ${idx + 1}`,
              credit: contribution.contributor.name
            }))
          : [{
              url: 'https://images.unsplash.com/photo-1590766940554-634ee7ef6981?auto=format&fit=crop&w=1200&q=80',
              caption: contribution.siteName,
              credit: contribution.contributor.name
            }];

        const city = contribution.siteLocation?.city || 'India';
        const state = contribution.siteLocation?.state || 'Gujarat';
        const coords = getCoordinatesForLocation(city, state, contribution.siteName);

        const newSite = new Site({
          name: contribution.siteName,
          slug: generatedSlug,
          type: contribution.siteType || 'Monument',
          location: {
            city: city,
            state: state,
            address: `${contribution.siteName}, ${city}`,
            coordinates: coords
          },
          description: contribution.content || `A documented heritage monument in ${city}, ${state}.`,
          photos: photoEntries,
          status: 'published',
          contributionCount: 1
        });

        await newSite.save();
        contribution.siteId = newSite._id;
      } else {
        contribution.siteId = existingSite._id;
      }
    }

    // If approved and has photos and linked to an existing site, add photos to that site
    if (status === 'approved' && contribution.siteId && contribution.type !== 'new_site' && contribution.photos.length > 0) {
      const photoEntries = contribution.photos.map(url => ({
        url,
        caption: contribution.content || 'Community contribution',
        credit: contribution.contributor.name
      }));
      await Site.findByIdAndUpdate(contribution.siteId, {
        $push: { photos: { $each: photoEntries } },
        $inc: { contributionCount: 1 }
      });
    }

    await contribution.save();

    res.json({
      message: `Contribution ${status} successfully! ${contribution.type === 'new_site' && status === 'approved' ? 'New site has been published to the catalog!' : ''}`,
      contribution
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/contributions/:id - Delete contribution
router.delete('/:id', async (req, res, next) => {
  try {
    const contribution = await Contribution.findByIdAndDelete(req.params.id);
    if (!contribution) {
      return res.status(404).json({ error: { message: 'Contribution not found' } });
    }
    res.json({ message: 'Contribution deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
