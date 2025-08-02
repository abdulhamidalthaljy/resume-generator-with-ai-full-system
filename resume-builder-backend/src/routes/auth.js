const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth routes
router.get('/google',
    (req, res, next) => {
        console.log('Starting Google auth...');
        next();
    },
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    (req, res, next) => {
        console.log('Received callback from Google');
        next();
    },
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:4201'}/login`,
        failureMessage: true
    }),
    (req, res) => {
        console.log('Authentication successful, user:', req.user);
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:4201'}/dashboard`);
    }
);

// Check authentication status
router.get('/status', (req, res) => {
    console.log('Checking auth status:', req.isAuthenticated(), req.user);
    res.json({
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});

// Logout route
router.get('/logout', (req, res, next) => {
    console.log('Logging out user:', req.user);
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:4201'}/login`);
    });
});

module.exports = router; 