const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });
const Site = require('../models/Site');
const User = require('../models/User');
const { fallbackSites } = require('../../client/src/data/fallbackSites');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/heritagewalk';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(' Connected to MongoDB for seeding');

    // 1. Seed Sites using verified clean photography dataset
    await Site.deleteMany({});
    const insertedSites = await Site.insertMany(fallbackSites.map(site => {
      const siteObj = { ...site };
      delete siteObj._id; // Let Mongo generate native ObjectId
      const s = new Site(siteObj);
      s.slug = site.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      return s;
    }));
    console.log(` Seeded ${insertedSites.length} heritage sites with high-resolution photography!`);

    // 2. Seed Default Accounts (Admin & User)
    await User.deleteMany({});

    // Admin account: admin@heritagewalk.com / admin123
    const adminUser = new User({
      name: "HeritageWalk Admin",
      email: "admin@heritagewalk.com",
      password: "admin123",
      role: "admin",
      location: "New Delhi, India",
      bio: "Official HeritageWalk platform administrator and preservation curator."
    });
    await adminUser.save();
   

    // Regular Explorer account: user@heritagewalk.com / user123
    const regularUser = new User({
      name: "Khushi Explorer",
      email: "user1@gmail.com",
      password: "user123",
      role: "user",
      location: "Ahmedabad, Gujarat",
      bio: "Heritage enthusiast and traveler passionate about documenting local architecture.",
      wishlist: [insertedSites[0]._id, insertedSites[1]._id]
    });
    await regularUser.save();
    
    await mongoose.disconnect();
    
    if (require.main === module) process.exit(0);
  } catch (err) {
    
    if (require.main === module) process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sites: fallbackSites };
