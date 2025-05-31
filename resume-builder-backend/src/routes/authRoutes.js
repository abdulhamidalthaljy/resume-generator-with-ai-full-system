const express = require('express');
const passport = require('passport');
const router = express.Router();

// Add this route to handle auth status checks
router.get('/status', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    // If user is authenticated, return user info
    return res.status(200).json({
      isAuthenticated: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
      }
    });
  } else {
    // If not authenticated
    return res.status(200).json({
      isAuthenticated: false,
      user: null
    });
  }
});

// Google auth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), (req, res) => {
  // After successful authentication, redirect to frontend
  res.redirect(process.env.CLIENT_URL || 'http://localhost:4201');
});

module.exports = router;