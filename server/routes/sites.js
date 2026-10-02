const express = require('express');
const router = express.Router();
const Site = require('../models/Site');

// GET /api/sites - Get all published sites with filtering, search, pagination
router.get('/', async (req, res, next) => {
  try {
    const { type, search, location, region, featured, page = 1, limit = 9 } = req.query;
    const filter = { status: 'published' };
    const conditions = [];

    const regionStates = {
      North: ['Jammu and Kashmir', 'Ladakh', 'Himachal Pradesh', 'Punjab', 'Chandigarh', 'Uttarakhand', 'Haryana', 'Delhi', 'Uttar Pradesh', 'Rajasthan'],
      South: ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana', 'Puducherry', 'Lakshadweep'],
      East: ['Bihar', 'Jharkhand', 'Odisha', 'West Bengal', 'Sikkim', 'Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura'],
      West: ['Goa', 'Gujarat', 'Maharashtra', 'Dadra and Nagar Haveli and Daman and Diu'],
      Central: ['Chhattisgarh', 'Madhya Pradesh']
    };

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSearch, 'i');
      conditions.push({ $or: [
        { name: regex },
        { 'location.city': regex },
        { 'location.state': regex },
        { description: regex }
      ] });
    }

    if (location) {
      const escapedLocation = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      conditions.push({
        $or: [
          { 'location.city': new RegExp(escapedLocation, 'i') },
          { 'location.state': new RegExp(escapedLocation, 'i') }
        ]
      });
    }

    if (region) {
      const regions = Array.isArray(region) ? region : String(region).split(',');
      const states = [...new Set(regions.flatMap(name => regionStates[name] || []))];
      if (states.length > 0) conditions.push({ 'location.state': { $in: states } });
    }

    if (conditions.length > 0) filter.$and = conditions;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [sites, total] = await Promise.all([
      Site.find(filter)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Site.countDocuments(filter)
    ]);

    res.json({
      sites,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/sites/types - Get distinct site types
router.get('/types', async (req, res, next) => {
  try {
    const types = await Site.distinct('type', { status: 'published' });
    res.json(types.sort());
  } catch (err) {
    next(err);
  }
});

// GET /api/sites/featured - Get featured sites
router.get('/featured', async (req, res, next) => {
  try {
    const sites = await Site.find({ status: 'published', featured: true })
      .sort({ createdAt: -1 })
      .limit(4);
    res.json(sites);
  } catch (err) {
    next(err);
  }
});

// GET /api/sites/:slug - Get single site by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const site = await Site.findOne({ slug: req.params.slug });
    if (!site) {
      return res.status(404).json({ error: { message: 'Heritage site not found' } });
    }
    res.json(site);
  } catch (err) {
    next(err);
  }
});

// POST /api/sites - Create a new site
router.post('/', async (req, res, next) => {
  try {
    const site = new Site(req.body);
    await site.save();
    res.status(201).json(site);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
});

// PUT /api/sites/:id - Update site
router.put('/:id', async (req, res, next) => {
  try {
    const site = await Site.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!site) {
      return res.status(404).json({ error: { message: 'Heritage site not found' } });
    }
    res.json(site);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: { message: err.message } });
    }
    next(err);
  }
});

// DELETE /api/sites/:id - Delete site
router.delete('/:id', async (req, res, next) => {
  try {
    const site = await Site.findByIdAndDelete(req.params.id);
    if (!site) {
      return res.status(404).json({ error: { message: 'Heritage site not found' } });
    }
    res.json({ message: 'Site deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
