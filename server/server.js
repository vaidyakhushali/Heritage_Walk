require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// =====================================================
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = [
  'https://heritagewalk.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin
    // Example: Postman, server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'OPTIONS'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ],

  credentials: true,

  optionsSuccessStatus: 204
};

// Apply CORS before routes
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// =====================================================
// GENERAL MIDDLEWARE
// =====================================================

app.use(express.json({ limit: '10mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb'
  })
);

// Morgan only during development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// =====================================================
// SERVE UPLOADED FILES
// =====================================================

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// =====================================================
// API ROUTES
// =====================================================

app.use(
  '/api/auth',
  require('./routes/auth')
);

app.use(
  '/api/sites',
  require('./routes/sites')
);

app.use(
  '/api/contributions',
  require('./routes/contributions')
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'HeritageWalk API is running',
    timestamp: new Date().toISOString()
  });
});

// =====================================================
// ROOT API CHECK
// =====================================================

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'HeritageWalk Backend API is running successfully',
    status: 'ok'
  });
});

// =====================================================
// PRODUCTION: SERVE REACT BUILD
// =====================================================

if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(
    __dirname,
    '..',
    'client',
    'dist'
  );

  app.use(express.static(clientBuild));

  // React Router fallback
  app.get('*', (req, res, next) => {
    // Do not return React index.html for API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }

    res.sendFile(
      path.join(clientBuild, 'index.html')
    );
  });
}

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      error: {
        message: `API route not found: ${req.method} ${req.originalUrl}`
      }
    });
  }

  next();
});

// =====================================================
// ERROR HANDLING
// =====================================================

app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  const status = err.status || 500;

  res.status(status).json({
    error: {
      message:
        err.message || 'Internal Server Error',

      ...(process.env.NODE_ENV !== 'production' && {
        stack: err.stack
      })
    }
  });
});

// =====================================================
// DATABASE & SERVER START
// =====================================================

const PORT = process.env.PORT || 5000;

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/heritagewalk';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // =================================================
    // AUTO SEED
    // =================================================

    try {
      const Site = require('./models/Site');

      const count = await Site.countDocuments();

      if (count === 0) {
        console.log(
          'Database is empty, auto-seeding initial heritage sites & demo accounts...'
        );

        const { sites } = require('./seed/seedData');

        const User = require('./models/User');

        // ---------------------------------------------
        // Insert Sites
        // ---------------------------------------------

        const insertedSites = await Site.insertMany(
          sites.map((site) => {
            const s = new Site(site);

            s.slug = site.name
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();

            return s;
          })
        );

        // ---------------------------------------------
        // Create Admin User
        // ---------------------------------------------

        const existingAdmin =
          await User.findOne({
            email: 'admin@heritagewalk.com'
          });

        if (!existingAdmin) {
          const adminUser = new User({
            name: 'HeritageWalk Admin',
            email: 'admin@heritagewalk.com',
            password: 'admin123',
            role: 'admin',
            location: 'New Delhi, India'
          });

          await adminUser.save();
        }

        // ---------------------------------------------
        // Create Demo User
        // ---------------------------------------------

        const existingDemoUser =
          await User.findOne({
            email: 'user@heritagewalk.com'
          });

        if (!existingDemoUser) {
          const demoUser = new User({
            name: 'Khushi Explorer',
            email: 'user@heritagewalk.com',
            password: 'user123',
            role: 'user',
            location: 'Ahmedabad, Gujarat',
            wishlist:
              insertedSites.length >= 2
                ? [
                    insertedSites[0]._id,
                    insertedSites[1]._id
                  ]
                : []
          });

          await demoUser.save();
        }

        console.log(
          `Auto-seeded ${insertedSites.length} sites and default Admin/User accounts!`
        );
      }
    } catch (e) {
      console.warn(
        'Auto-seed check note:',
        e.message
      );
    }

    // =================================================
    // START SERVER
    // =================================================

    app.listen(PORT, () => {
      console.log(
        `HeritageWalk server running on port ${PORT}`
      );

      console.log(
        `Environment: ${
          process.env.NODE_ENV || 'development'
        }`
      );

      console.log(
        `API: http://localhost:${PORT}/api`
      );
    });
  })
  .catch((err) => {
    console.error(
      'MongoDB connection error:',
      err.message
    );

    console.error(
      'Make sure MongoDB is running and MONGODB_URI is correct.'
    );

    process.exit(1);
  });

module.exports = app;