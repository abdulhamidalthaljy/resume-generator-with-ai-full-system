const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.name
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};