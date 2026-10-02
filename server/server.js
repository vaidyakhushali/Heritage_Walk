require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// --------------- Middleware ---------------
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? true
    : ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------- Routes ---------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sites', require('./routes/sites'));
app.use('/api/contributions', require('./routes/contributions'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- Production: Serve React Build ---------------
if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

// --------------- Error Handling ---------------
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
});

// --------------- Database & Server Start ---------------
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/heritagewalk';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // Auto-seed if database is empty
    try {
      const Site = require('./models/Site');
      const count = await Site.countDocuments();
      if (count === 0) {
        console.log('🌱 Database is empty, auto-seeding initial heritage sites & demo accounts...');
        const { sites } = require('./seed/seedData');
        const User = require('./models/User');

        const insertedSites = await Site.insertMany(sites.map(site => {
          const s = new Site(site);
          s.slug = site.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
          return s;
        }));

        const adminUser = new User({
          name: "HeritageWalk Admin",
          email: "admin@heritagewalk.com",
          password: "admin123",
          role: "admin",
          location: "New Delhi, India"
        });
        await adminUser.save();

        const demoUser = new User({
          name: "Khushi Explorer",
          email: "user@heritagewalk.com",
          password: "user123",
          role: "user",
          location: "Ahmedabad, Gujarat",
          wishlist: [insertedSites[0]._id, insertedSites[1]._id]
        });
        await demoUser.save();
        console.log(`✅ Auto-seeded ${insertedSites.length} sites and default Admin/User accounts!`);
      }
    } catch (e) {
      console.warn('Auto-seed check note:', e.message);
    }

    app.listen(PORT, () => {
      console.log(`🚀 HeritageWalk server running on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('   Make sure MongoDB is running and MONGODB_URI is correct.');
    process.exit(1);
  });

module.exports = app;
