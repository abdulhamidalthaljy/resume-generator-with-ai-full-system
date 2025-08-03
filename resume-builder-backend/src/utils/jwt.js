const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a JWT token for a user
 * @param {Object} user - The user object
 * @returns {string} JWT token
 */
function generateToken(user) {
    console.log('JWT Generation - user:', user);
    console.log('JWT Generation - user._id:', user._id);
    console.log('JWT Generation - user.id:', user.id);

    const payload = {
        id: user._id ? user._id.toString() : user.id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar
    };

    console.log('JWT Generation - payload:', payload);

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - The JWT token
 * @returns {Object} Decoded user data
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

module.exports = {
    generateToken,
    verifyToken
};
