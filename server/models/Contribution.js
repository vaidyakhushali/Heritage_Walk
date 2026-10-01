const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    default: null
  },
  siteName: {
    type: String,
    trim: true
  },
  siteType: {
    type: String,
    enum: ['Stepwell', 'Temple', 'Haveli', 'Colonial Building', 'Fort', 'Monument', 'Other'],
    default: 'Monument'
  },
  siteLocation: {
    city: { type: String, trim: true },
    state: { type: String, trim: true }
  },
  type: {
    type: String,
    required: [true, 'Contribution type is required'],
    enum: ['photo', 'information', 'new_site', 'correction']
  },
  contributor: {
    name: { type: String, required: [true, 'Contributor name is required'], trim: true },
    email: { type: String, required: [true, 'Contributor email is required'], trim: true, lowercase: true }
  },
  content: {
    type: String,
    trim: true
  },
  photos: [{
    type: String
  }],
  videos: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewNote: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Contribution', contributionSchema);
