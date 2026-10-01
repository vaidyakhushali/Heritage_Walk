const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Site name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    required: [true, 'Site type is required'],
    enum: ['Stepwell', 'Temple', 'Haveli', 'Colonial Building', 'Fort', 'Monument', 'Other']
  },
  location: {
    city: { type: String, required: [true, 'City is required'], trim: true },
    state: { type: String, required: [true, 'State is required'], trim: true },
    address: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  period: {
    type: String,
    trim: true
  },
  significance: {
    type: String
  },
  practicalInfo: {
    timings: { type: String },
    entryFee: { type: String },
    bestTimeToVisit: { type: String },
    photographyTips: { type: String }
  },
  photos: [{
    url: { type: String },
    caption: { type: String },
    credit: { type: String }
  }],
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  contributionCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-generate slug from name before saving
siteSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Text index for search
siteSchema.index({ name: 'text', 'location.city': 'text', 'location.state': 'text' });

module.exports = mongoose.model('Site', siteSchema);
