// src/middleware/ensureAuth.js

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        console.log('User authenticated:', req.user);
        return next();
    }
    console.log('User not authenticated');
    res.status(401).json({ message: 'Unauthorized - Please log in' });
}

module.exports = ensureAuthenticated;
