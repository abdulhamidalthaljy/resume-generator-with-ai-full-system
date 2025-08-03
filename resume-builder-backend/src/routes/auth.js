const express = require('express');
const passport = require('passport');
const { generateToken, verifyToken } = require('../utils/jwt');
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
        try {
            // Log successful authentication for debugging
            console.log('Google OAuth successful, user:', req.user);
            console.log('Google OAuth user._id:', req.user._id);
            console.log('Google OAuth user.id:', req.user.id);

            // Generate JWT token
            const token = generateToken(req.user);
            console.log('Generated JWT token for user:', req.user.email);

            // Redirect to frontend with token as URL parameter
            const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:4201'}/dashboard?token=${token}`;
            res.redirect(redirectUrl);
        } catch (error) {
            console.error('JWT generation error:', error);
            res.redirect(`${process.env.CLIENT_URL || 'http://localhost:4201'}/login`);
        }
    }
);

// Check authentication status
router.get('/status', (req, res) => {
    try {
        // Check for JWT token in Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;

        console.log('Auth status check:');
        console.log('- Authorization header:', authHeader);
        console.log('- Token present:', !!token);

        if (!token) {
            console.log('- No token provided');
            return res.json({
                isAuthenticated: false,
                user: null
            });
        }

        // Verify JWT token
        const decoded = verifyToken(token);
        console.log('- Token valid, user:', decoded.email);

        res.json({
            isAuthenticated: true,
            user: {
                _id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.avatar
            }
        });

    } catch (error) {
        console.log('- Token verification failed:', error.message);
        res.json({
            isAuthenticated: false,
            user: null
        });
    }
});

// Logout route
router.get('/logout', (req, res, next) => {
    // For JWT-based auth, logout is handled on the frontend by removing the token
    // We just redirect to login page
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:4201'}/login`);
});

module.exports = router; 