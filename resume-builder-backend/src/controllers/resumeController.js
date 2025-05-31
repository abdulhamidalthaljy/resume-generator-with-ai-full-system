// src/controllers/resumeController.js
const { User } = require('../models/User');
const mongoose = require('mongoose');

// Controller functions for resume CRUD operations

// Get all resumes for the authenticated user
exports.getAllResumes = async (req, res, next) => {
    try {
        console.log("CONTROLLER: getAllResumes called for user:", req.user.id);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found:", user.name);
        console.log("User resumes count:", user.resumes ? user.resumes.length : 0);
        console.log("First resume:", user.resumes && user.resumes[0] ? user.resumes[0] : "None");
        console.log("Resume structure:", user.resumes && user.resumes[0] ? typeof user.resumes[0] : "N/A");

        // Check if resumes array contains ObjectIds instead of objects
        if (user.resumes && user.resumes.length > 0 && typeof user.resumes[0] === 'string') {
            console.warn("Found ObjectId references instead of embedded documents. This data needs migration.");

            // For now, return empty array to prevent frontend errors
            // TODO: Implement data migration
            return res.status(200).json([]);
        }

        // Return user's resumes (embedded documents)
        res.status(200).json(user.resumes || []);
    } catch (error) {
        console.error("Error in getAllResumes:", error);
        next(error);
    }
};

// Create a new resume for the authenticated user
exports.createResume = async (req, res, next) => {
    try {
        const resumeData = req.body;

        // Log payload size for debugging
        const payloadSize = JSON.stringify(resumeData).length;
        console.log("CONTROLLER: createResume called");
        console.log("Payload size:", {
            bytes: payloadSize,
            kb: (payloadSize / 1024).toFixed(2),
            mb: (payloadSize / 1024 / 1024).toFixed(2)
        });
        console.log("Received resume data:", JSON.stringify(resumeData, null, 2));

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

        console.log("Created new resume object:", JSON.stringify(newResume, null, 2));

        // Add resume to user's resumes array
        user.resumes.push(newResume);
        await user.save();

        console.log("Resume saved successfully with ID:", newResume._id);

        res.status(201).json(newResume);
    } catch (error) {
        console.error("Error in createResume:", error);
        next(error);
    }
};

// Get a specific resume by ID for the authenticated user
exports.getResumeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`CONTROLLER: getResumeById called for id: ${id}`);

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
        console.error("Error in getResumeById:", error);
        next(error);
    }
};

// Update a resume by ID for the authenticated user
exports.updateResumeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resumeData = req.body;
        console.log(`CONTROLLER: updateResumeById called for id: ${id}`);
        console.log("Update data received:", JSON.stringify(resumeData, null, 2));

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find resume index in user's resumes array
        const resumeIndex = user.resumes.findIndex(r => r._id.toString() === id);

        if (resumeIndex === -1) {
            return res.status(404).json({ message: "Resume not found for update" });
        }

        console.log("Found resume at index:", resumeIndex);
        console.log("Existing resume data:", JSON.stringify(user.resumes[resumeIndex], null, 2));

        // Update resume while preserving _id and createdAt
        user.resumes[resumeIndex] = {
            ...resumeData,
            _id: user.resumes[resumeIndex]._id,
            createdAt: user.resumes[resumeIndex].createdAt,
            updatedAt: new Date()
        };

        console.log("Updated resume data:", JSON.stringify(user.resumes[resumeIndex], null, 2));

        await user.save();

        console.log("Resume updated successfully");

        res.status(200).json(user.resumes[resumeIndex]);
    } catch (error) {
        console.error("Error in updateResumeById:", error);
        next(error);
    }
};

// Delete a resume by ID for the authenticated user
exports.deleteResumeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`CONTROLLER: deleteResumeById called for id: ${id}`);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find resume index in user's resumes array
        const resumeIndex = user.resumes.findIndex(r => r._id.toString() === id);

        if (resumeIndex === -1) {
            return res.status(404).json({ message: "Resume not found for deletion" });
        }

        // Remove resume from array
        user.resumes.splice(resumeIndex, 1);
        await user.save();

        res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        console.error("Error in deleteResumeById:", error);
        next(error);
    }
};

// Debug endpoint to get user data
exports.debugUser = async (req, res, next) => {
    try {
        console.log("CONTROLLER: debugUser called for user:", req.user.id);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                resumesCount: user.resumes ? user.resumes.length : 0,
                resumes: user.resumes,
                resumeTypes: user.resumes ? user.resumes.map(r => typeof r) : []
            }
        });
    } catch (error) {
        console.error("Error in debugUser:", error);
        next(error);
    }
};

// Fix corrupted resume data (migration function)
exports.fixUserData = async (req, res, next) => {
    try {
        console.log("CONTROLLER: fixUserData called for user:", req.user.id);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Before fix - resumes:", user.resumes);

        // Check if resumes contains ObjectId strings instead of objects
        if (user.resumes && user.resumes.length > 0) {
            const corruptedResumes = user.resumes.filter(resume => typeof resume === 'string' || resume instanceof mongoose.Types.ObjectId);

            if (corruptedResumes.length > 0) {
                console.log("Found corrupted resume references:", corruptedResumes);

                // Clear the corrupted references
                user.resumes = user.resumes.filter(resume => typeof resume === 'object' && !(resume instanceof mongoose.Types.ObjectId));

                await user.save();

                res.status(200).json({
                    message: "Data fixed successfully",
                    removedCorruptedEntries: corruptedResumes.length,
                    remainingResumes: user.resumes.length
                });
            } else {
                res.status(200).json({
                    message: "No corrupted data found",
                    resumesCount: user.resumes.length
                });
            }
        } else {
            res.status(200).json({
                message: "No resumes found",
                resumesCount: 0
            });
        }
    } catch (error) {
        console.error("Error in fixUserData:", error);
        next(error);
    }
};