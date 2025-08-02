// src/middleware/ensureAuth.js

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized - Please log in' });
}

module.exports = ensureAuthenticated;
