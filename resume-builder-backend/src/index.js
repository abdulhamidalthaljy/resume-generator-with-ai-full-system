require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumeRoutes');
const pdfRoutes = require('./routes/pdfRoutes'); // Import PDF routes

// Passport config
require('./config/passport');

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:4201',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4201',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS required in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Required for cross-origin in production
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware (removed for production)
// app.use((req, res, next) => {
//     console.log('Session:', req.session);
//     console.log('User:', req.user);
//     next();
// });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/pdf', pdfRoutes); // Add PDF routes

// Socket.io connection handling
let connectedUsers = new Map(); // Track connected users

io.on('connection', (socket) => {

    // User joins the application
    socket.on('user:join', (userData) => {
        connectedUsers.set(socket.id, {
            id: socket.id,
            ...userData,
            connectedAt: new Date()
        });
        // Broadcast user count update
        io.emit('users:count', connectedUsers.size);

        // Send welcome message
        socket.emit('notification', {
            type: 'success',
            message: 'Connected to Resume Builder',
            timestamp: new Date()
        });
    });

    // User starts editing a resume
    socket.on('resume:editing', (data) => {
        socket.broadcast.emit('user:activity', {
            type: 'editing',
            user: connectedUsers.get(socket.id)?.name || 'Someone',
            resumeId: data.resumeId,
            templateName: data.templateName,
            timestamp: new Date()
        });
    });

    // Resume created
    socket.on('resume:created', (data) => {
        io.emit('resume:activity', {
            type: 'created',
            user: connectedUsers.get(socket.id)?.name || 'Someone',
            resumeTitle: data.resumeTitle || 'New Resume',
            templateName: data.templateName,
            timestamp: new Date()
        });

        io.emit('notification', {
            type: 'info',
            message: `${connectedUsers.get(socket.id)?.name || 'Someone'} created a new resume using ${data.templateName} template`,
            timestamp: new Date()
        });
    });

    // Resume updated
    socket.on('resume:updated', (data) => {
        socket.broadcast.emit('resume:activity', {
            type: 'updated',
            user: connectedUsers.get(socket.id)?.name || 'Someone',
            resumeTitle: data.resumeTitle || 'Resume',
            templateName: data.templateName,
            timestamp: new Date()
        });
    });

    // Template changed
    socket.on('template:changed', (data) => {
        socket.broadcast.emit('user:activity', {
            type: 'template_change',
            user: connectedUsers.get(socket.id)?.name || 'Someone',
            oldTemplate: data.oldTemplate,
            newTemplate: data.newTemplate,
            timestamp: new Date()
        });
    });

    // User disconnection
    socket.on('disconnect', () => {
        const user = connectedUsers.get(socket.id);
        connectedUsers.delete(socket.id);

        // Broadcast updated user count
        io.emit('users:count', connectedUsers.size);

        if (user) {
            socket.broadcast.emit('user:activity', {
                type: 'disconnected',
                user: user.name || 'Someone',
                timestamp: new Date()
            });
        }
    });
});

// Make io available to routes
app.set('io', io);

// Protected route example
app.get('/api/dashboard', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({
        user: req.user,
        message: 'Welcome to your dashboard'
    });
});

const PORT = process.env.PORT || 5050; // Railway will provide PORT
server.listen(PORT, '0.0.0.0', () => { // Bind to all interfaces for Railway
    console.log(`Server running on port ${PORT}`);
}); 