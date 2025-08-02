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
        // Log successful authentication for debugging
        console.log('Google OAuth successful, user:', req.user);
        console.log('Session ID:', req.sessionID);

        // Ensure session is saved before redirecting
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:4201'}/login`);
            }
            res.redirect(`${process.env.CLIENT_URL || 'http://localhost:4201'}/dashboard`);
        });
    }
);

// Check authentication status
router.get('/status', (req, res) => {
    console.log('Auth status check:');
    console.log('- Session ID:', req.sessionID);
    console.log('- Is Authenticated:', req.isAuthenticated());
    console.log('- User:', req.user);
    console.log('- Session:', req.session);

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