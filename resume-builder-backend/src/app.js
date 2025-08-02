// src/app.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('./config/passport'); // Load passport configuration
const resumeRoutes = require('./routes/resumeRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const pdfRoutes = require('./routes/pdfRoutes'); // Import PDF routes
const ensureAuthenticated = require('./middleware/ensureAuth');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Middleware ---
// Configure CORS for our Angular frontend
const corsOptions = {
  origin: [
    'http://localhost:4201', // Angular dev server port
    'http://localhost:4200', // Alternative Angular dev server port
    'https://resume-generator-with-ai-full-syste.vercel.app', // Production frontend URL
    process.env.CLIENT_URL // Environment variable for frontend URL
  ].filter(Boolean), // Remove any undefined values
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow cookies if you need them
};

app.use(cors(corsOptions));

// Session configuration (MUST come before passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport (MUST come after session)
app.use(passport.initialize());
app.use(passport.session());

// IMPORTANT: These body parsers MUST come BEFORE your routes that need them (like resumeRoutes)
app.use(express.json({ limit: '100mb' })); // For parsing application/json
app.use(express.urlencoded({ extended: true, limit: '100mb' })); // For parsing application/x-www-form-urlencoded

// --- Basic Route (for testing) ---
app.get('/', (req, res) => {
  res.send('Resume Builder API is alive!');
});

// --- API Routes ---
// This should come AFTER the body parsers
app.use('/api/resumes', resumeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes); // Add PDF routes

// --- Protected Route Example ---
// app.get('/api/protected', ensureAuthenticated, (req, res) => {
//   res.send('This is a protected route');
// });

// --- Error Handling Middleware (Basic Example) ---
// This should be defined AFTER all your routes
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Something went wrong!',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    }
  });
});

module.exports = app;