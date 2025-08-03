// src/middleware/ensureAuth.js
const { verifyToken } = require('../utils/jwt');

function ensureAuthenticated(req, res, next) {
    // First check for JWT token in Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

    if (token) {
        try {
            // Verify JWT token
            const decoded = verifyToken(token);
            req.user = {
                id: decoded.id,
                _id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.avatar
            };
            return next();
        } catch (error) {
            console.error('JWT verification failed:', error.message);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    }

    // Fallback to session-based auth for backward compatibility
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    // No valid authentication found
    res.status(401).json({ message: 'Unauthorized - Please log in' });
}

module.exports = ensureAuthenticated;
