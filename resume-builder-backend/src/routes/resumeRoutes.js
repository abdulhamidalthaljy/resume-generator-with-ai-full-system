// src/routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const ensureAuthenticated = require('../middleware/ensureAuth');

console.log("resumeRoutes loaded");

// Test route (no auth) - Must be before /:id route
router.get('/test', (req, res) => {
    res.json({ message: "Test route works!" });
});

// Debug route to check user data structure
router.get('/debug/user', ensureAuthenticated, async (req, res) => {
    try {
        const { User } = require('../models/User');
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            userId: user._id,
            name: user.name,
            email: user.email,
            resumesCount: user.resumes ? user.resumes.length : 0,
            resumes: user.resumes || [],
            resumeStructure: user.resumes && user.resumes[0] ? Object.keys(user.resumes[0]) : [],
            firstResumeType: user.resumes && user.resumes[0] ? typeof user.resumes[0] : 'undefined',
            rawUserData: user.toObject()
        });
    } catch (error) {
        console.error("Debug route error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Migration endpoint to fix corrupted resume data
router.post('/migrate/fix-resume-data', ensureAuthenticated, async (req, res) => {
    try {
        const { User } = require('../models/User');
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Before migration:", user.resumes);

        // Check if resumes are ObjectId references (strings)
        if (user.resumes && user.resumes.length > 0 && typeof user.resumes[0] === 'string') {
            console.log("Found corrupted data, clearing resumes array");
            user.resumes = []; // Clear the corrupted data
            await user.save();

            res.json({
                message: "Resume data migration completed. Corrupted ObjectId references removed.",
                resumesCount: 0,
                action: "cleared_corrupted_data"
            });
        } else {
            res.json({
                message: "No migration needed. Resume data is already in correct format.",
                resumesCount: user.resumes ? user.resumes.length : 0,
                action: "no_action_needed"
            });
        }
    } catch (error) {
        console.error("Migration error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Debug routes for development
router.get('/debug/user-new', ensureAuthenticated, resumeController.debugUser);
router.post('/fix-data', ensureAuthenticated, resumeController.fixUserData);

// GET /api/resumes - Get all resumes
router.get('/', ensureAuthenticated, resumeController.getAllResumes);

// POST /api/resumes - Create a new resume
router.post('/', ensureAuthenticated, resumeController.createResume);

// GET /api/resumes/:id - Get a single resume by ID
router.get('/:id', ensureAuthenticated, resumeController.getResumeById);

// PUT /api/resumes/:id - Update a resume by ID
router.put('/:id', ensureAuthenticated, resumeController.updateResumeById);

// DELETE /api/resumes/:id - Delete a resume by ID
router.delete('/:id', ensureAuthenticated, resumeController.deleteResumeById);

module.exports = router;