const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

const originalLoad = Module._load;

const expressStub = {
  Router() {
    return {
      post() {},
      get() {},
      patch() {},
      delete() {}
    };
  }
};

const multerStub = Object.assign(
  () => ({ array: () => (req, res, next) => next() }),
  {
    memoryStorage: () => 'memory-storage'
  }
);

const cloudinaryStub = {
  config() {},
  uploader: {
    upload_stream: (_options, callback) => {
      callback(null, { secure_url: 'https://example.com/cloudinary/image.jpg' });
      return { end() {} };
    }
  }
};

const fakeContribution = class {
  constructor(data) { this.data = data; }
  async save() { return this; }
};

const fakeSite = {
  findByIdAndUpdate() { return Promise.resolve(); }
};

Module._load = function(request, parent, isMain) {
  if (request === 'express') return expressStub;
  if (request === 'multer') return multerStub;
  if (request === 'cloudinary') return { v2: cloudinaryStub };
  if (request === '../models/Contribution') return fakeContribution;
  if (request === '../models/Site') return fakeSite;
  if (request === '../middleware/auth') return () => (req, res, next) => next();
  if (request === '../utils/geoLookup') return { getCoordinatesForLocation: async () => ({}) };
  return originalLoad.apply(this, arguments);
};

const uploadModule = require('../routes/contributions');

test('uploads media locally when Cloudinary is not configured', async () => {
  const previousCloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const previousApiKey = process.env.CLOUDINARY_API_KEY;
  const previousApiSecret = process.env.CLOUDINARY_API_SECRET;

  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;

  try {
    const result = await uploadModule.uploadMedia({
      mimetype: 'image/jpeg',
      buffer: Buffer.from('fake-image-bytes')
    });

    assert.ok(result.url.startsWith('/uploads/images/'));
    assert.equal(result.resourceType, 'image');

    const uploadFileName = path.basename(result.url);
    const fullPath = path.join(__dirname, '..', 'uploads', 'images', uploadFileName);
    assert.ok(fs.existsSync(fullPath));
    fs.unlinkSync(fullPath);
  } finally {
    Module._load = originalLoad;
    if (previousCloudName === undefined) delete process.env.CLOUDINARY_CLOUD_NAME;
    else process.env.CLOUDINARY_CLOUD_NAME = previousCloudName;
    if (previousApiKey === undefined) delete process.env.CLOUDINARY_API_KEY;
    else process.env.CLOUDINARY_API_KEY = previousApiKey;
    if (previousApiSecret === undefined) delete process.env.CLOUDINARY_API_SECRET;
    else process.env.CLOUDINARY_API_SECRET = previousApiSecret;
  }
});
