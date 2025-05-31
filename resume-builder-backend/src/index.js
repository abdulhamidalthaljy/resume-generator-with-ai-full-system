require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumeRoutes');

// Passport config
require('./config/passport');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4201',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
        // Removed domain restriction for local development
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware
app.use((req, res, next) => {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

// Protected route example
app.get('/api/dashboard', (req, res) => {
    console.log('Dashboard access attempt:', req.isAuthenticated(), req.user);
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({
        user: req.user,
        message: 'Welcome to your dashboard'
    });
});

const PORT = 5050; // Using port 5050 instead
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 