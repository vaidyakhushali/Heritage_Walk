require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// =====================================================
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'https://heritagewalk.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // In production, allow all origins if requested or if matched with allowedOrigins / vercel previews
    if (!origin) {
      return callback(null, true);
    }

    if (
      process.env.NODE_ENV === 'production' ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app')
    ) {
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

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 HeritageWalk server running on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   API: http://localhost:${PORT}/api`);
    });
  });
}

module.exports = app;