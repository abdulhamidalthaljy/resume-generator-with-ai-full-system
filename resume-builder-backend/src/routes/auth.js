const express = require('express');
const passport = require('passport');
const { generateToken } = require('../utils/jwt');
const router = express.Router();

// Get client URL from environment
const getClientUrl = () => {
    return process.env.CLIENT_URL || 'http://localhost:4201';
};

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
        failureRedirect: `${getClientUrl()}/login?error=auth_failed`,
        failureMessage: true
    }),
    (req, res) => {
        try {
            console.log('Authentication successful, user:', req.user);

            // Generate JWT token
            const token = generateToken(req.user);

            // Redirect to frontend with token as query parameter
            res.redirect(`${getClientUrl()}/dashboard?token=${token}`);
        } catch (error) {
            console.error('Error during auth callback:', error);
            res.redirect(`${getClientUrl()}/login?error=server_error`);
        }
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
        res.redirect(`${getClientUrl()}/login?logout=success`);
    });
});

module.exports = router; 