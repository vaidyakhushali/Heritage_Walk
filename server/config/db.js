const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/heritagewalk';

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);

    // Auto-seed initial dataset and default accounts if database is empty
    await autoSeedIfNeeded();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('   Make sure MongoDB is running and MONGODB_URI is correct.');
    process.exit(1);
  }
};

async function autoSeedIfNeeded() {
  try {
    const Site = require('../models/Site');
    const User = require('../models/User');

    const count = await Site.countDocuments();
    if (count === 0) {
      console.log(' Database is empty, auto-seeding initial heritage sites & demo accounts...');
      const { sites } = require('../seed/seedData');

      const insertedSites = await Site.insertMany(
        sites.map((site) => {
          const siteObj = { ...site };
          delete siteObj._id;
          const s = new Site(siteObj);
          s.slug = site.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
          return s;
        })
      );

      // Create or update default Admin
      let adminUser = await User.findOne({ email: 'admin@heritagewalk.com' });
      if (!adminUser) {
        adminUser = new User({
          name: 'HeritageWalk Admin',
          email: 'admin@heritagewalk.com',
          password: 'admin123',
          role: 'admin',
          location: 'New Delhi, India'
        });
        await adminUser.save();
      } else if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
      }

      // Create default Demo User
      const existingDemo = await User.findOne({ email: 'user@heritagewalk.com' });
      if (!existingDemo) {
        const demoUser = new User({
          name: 'Khushi Explorer',
          email: 'user@heritagewalk.com',
          password: 'user123',
          role: 'user',
          location: 'Ahmedabad, Gujarat',
          wishlist: insertedSites.length >= 2 ? [insertedSites[0]._id, insertedSites[1]._id] : []
        });
        await demoUser.save();
      }

      console.log(` Auto-seeded ${insertedSites.length} sites and verified Admin/User accounts!`);
    } else {
      // Ensure admin user role is always 'admin' even in an already populated DB
      const adminUser = await User.findOne({ email: 'admin@heritagewalk.com' });
      if (adminUser && adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
      }
    }
  } catch (err) {
    console.warn('Auto-seed check note:', err.message);
  }
}

module.exports = connectDB;
