const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:4201'}/login`,
        failureMessage: true
    }),
    (req, res) => {
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:4201'}/dashboard`);
    }
);

// Check authentication status
router.get('/status', (req, res) => {
    res.json({
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:4201'}/login`);
    });
});

module.exports = router; 