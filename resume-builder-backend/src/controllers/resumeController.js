// src/controllers/resumeController.js
const { User } = require('../models');
const mongoose = require('mongoose');

// Controller functions for resume CRUD operations

// Get all resumes for the authenticated user
exports.getAllResumes = async (req, res, next) => {
    try {
        // Test if we can connect to the database at all
        const mongoose = require('mongoose');

        // Try to validate the ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            // Let's also try to find the user by email to debug
            const userByEmail = await User.findOne({ email: req.user.email });
            if (userByEmail) {
                // User found by email, use that user instead
                user = userByEmail;
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        }

        // Check if resumes array contains ObjectIds instead of objects
        if (user.resumes && user.resumes.length > 0 && typeof user.resumes[0] === 'string') {
            // Return empty array for corrupted data
            return res.status(200).json([]);
        }

        // Return user's resumes (embedded documents)
        res.status(200).json(user.resumes || []);
    } catch (error) {
        next(error);
    }
};

// Create a new resume for the authenticated user
exports.createResume = async (req, res, next) => {
    try {
        const resumeData = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create new resume with timestamp
        const newResume = {
            ...resumeData,
            _id: new mongoose.Types.ObjectId(),
            title: resumeData.title || 'Untitled Resume',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Add resume to user's resumes array
        user.resumes.push(newResume);
        await user.save();

        // Emit Socket.io event for resume creation
        const io = req.app.get('io');
        if (io) {
            io.emit('resume:activity', {
                type: 'created',
                user: user.name || 'Someone',
                resumeTitle: newResume.title,
                templateName: resumeData.templateId || 'Default',
                timestamp: new Date()
            });

            io.emit('notification', {
                type: 'success',
                message: `${user.name || 'Someone'} created a new resume: ${newResume.title}`,
                timestamp: new Date()
            });
        }

        res.status(201).json(newResume);
    } catch (error) {
        next(error);
    }
};

// Get a specific resume by ID for the authenticated user
exports.getResumeById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find resume in user's resumes array
        const resume = user.resumes.find(r => r._id.toString() === id);

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(resume);
    } catch (error) {
        next(error);
    }
};

// Update a resume by ID for the authenticated user
exports.updateResumeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resumeData = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find resume index in user's resumes array
        const resumeIndex = user.resumes.findIndex(r => r._id.toString() === id);

        if (resumeIndex === -1) {
            return res.status(404).json({ message: "Resume not found for update" });
        }

        // Update resume while preserving _id and createdAt
        user.resumes[resumeIndex] = {
            ...resumeData,
            _id: user.resumes[resumeIndex]._id,
            createdAt: user.resumes[resumeIndex].createdAt,
            updatedAt: new Date()
        };

        await user.save();

        // Emit Socket.io event for resume update
        const io = req.app.get('io');
        if (io) {
            io.emit('resume:activity', {
                type: 'updated',
                user: user.name || 'Someone',
                resumeTitle: user.resumes[resumeIndex].title || 'Resume',
                templateName: resumeData.templateId || 'Default',
                timestamp: new Date()
            });
        }

        res.status(200).json(user.resumes[resumeIndex]);
    } catch (error) {
        next(error);
    }
};

// Delete a resume by ID for the authenticated user
exports.deleteResumeById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find resume index in user's resumes array
        const resumeIndex = user.resumes.findIndex(r => r._id.toString() === id);

        if (resumeIndex === -1) {
            return res.status(404).json({ message: "Resume not found for deletion" });
        }

        const deletedResume = user.resumes[resumeIndex];

        // Remove resume from array
        user.resumes.splice(resumeIndex, 1);
        await user.save();

        // Emit Socket.io event for resume deletion
        const io = req.app.get('io');
        if (io) {
            io.emit('resume:activity', {
                type: 'deleted',
                user: user.name || 'Someone',
                resumeTitle: deletedResume.title || 'Resume',
                timestamp: new Date()
            });

            io.emit('notification', {
                type: 'info',
                message: `${user.name || 'Someone'} deleted a resume: ${deletedResume.title}`,
                timestamp: new Date()
            });
        }

        res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        next(error);
    }
};

