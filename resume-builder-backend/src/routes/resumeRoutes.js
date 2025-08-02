const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const ensureAuthenticated = require('../middleware/ensureAuth');

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