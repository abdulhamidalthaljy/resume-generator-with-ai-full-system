const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/User');

// Configure Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '1234567890-example.apps.googleusercontent.com', // Replace with your actual Client ID
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'EXAMPLE-secret-EXAMPLE', // Replace with your actual Client Secret
    callbackURL: '/api/auth/google/callback',
    proxy: true
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            // Check if user already exists
            let user = await User.findOne({ googleId: profile.id }); if (!user) {
                // Create new user if not found
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value || '',
                    avatar: profile.photos?.[0]?.value || ''
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

// Serial/deserialize user (required for sessions)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;