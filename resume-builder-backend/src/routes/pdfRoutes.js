const express = require('express');
const router = express.Router();
const PDFGeneratorService = require('../services/pdfGeneratorService');
const { User } = require('../models/User');

const pdfService = new PDFGeneratorService();

// Generate PDF for a resume
router.post('/generate/:resumeId', async (req, res) => {
    try {
        console.log(`Generating PDF for resume ID: ${req.params.resumeId}`);

        // Find the user with the resume
        const user = await User.findOne({ 'resumes._id': req.params.resumeId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User with resume not found'
            });
        }

        // Find the specific resume within the user's resumes
        const resume = user.resumes.id(req.params.resumeId);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Get template from query parameter or use default
        const templateId = req.query.template || resume.templateId || 'classic';

        // Generate PDF
        const pdfBuffer = await pdfService.generateResumePDF(resume, templateId);

        // Set response headers for PDF download
        const filename = `${resume.personalDetails?.name || 'Resume'}_${Date.now()}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send PDF buffer
        res.send(pdfBuffer);

        console.log(`PDF generated successfully for resume: ${req.params.resumeId}`);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate PDF',
            error: error.message
        });
    }
});

// Generate preview image for a resume
router.post('/preview/:resumeId', async (req, res) => {
    try {
        console.log(`Generating preview for resume ID: ${req.params.resumeId}`);

        // Find the user with the resume
        const user = await User.findOne({ 'resumes._id': req.params.resumeId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User with resume not found'
            });
        }

        // Find the specific resume within the user's resumes
        const resume = user.resumes.id(req.params.resumeId);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Get template from query parameter or use default
        const templateId = req.query.template || resume.templateId || 'classic';

        // Generate preview image
        const imageBuffer = await pdfService.generateResumePreview(resume, templateId);

        // Set response headers for image
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', imageBuffer.length);

        // Send image buffer
        res.send(imageBuffer);

        console.log(`Preview generated successfully for resume: ${req.params.resumeId}`);

    } catch (error) {
        console.error('Error generating preview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate preview',
            error: error.message
        });
    }
});

// Generate PDF from resume data (without saving to database)
router.post('/generate-direct', async (req, res) => {
    try {
        console.log('Generating PDF from provided resume data');

        const { resumeData, templateId = 'classic' } = req.body;

        if (!resumeData) {
            return res.status(400).json({
                success: false,
                message: 'Resume data is required'
            });
        }

        // Generate PDF
        const pdfBuffer = await pdfService.generateResumePDF(resumeData, templateId);

        // Set response headers for PDF download
        const filename = `${resumeData.personalDetails?.name || 'Resume'}_${Date.now()}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send PDF buffer
        res.send(pdfBuffer);

        console.log('PDF generated successfully from provided data');

    } catch (error) {
        console.error('Error generating PDF from data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate PDF',
            error: error.message
        });
    }
});

// Health check for PDF service
router.get('/health', async (req, res) => {
    try {
        await pdfService.initialize();
        res.json({
            success: true,
            message: 'PDF service is healthy',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('PDF service health check failed:', error);
        res.status(500).json({
            success: false,
            message: 'PDF service is not healthy',
            error: error.message
        });
    }
});

// Close browser on shutdown
process.on('SIGTERM', async () => {
    console.log('Closing PDF service browser...');
    await pdfService.closeBrowser();
});

process.on('SIGINT', async () => {
    console.log('Closing PDF service browser...');
    await pdfService.closeBrowser();
});

module.exports = router;
