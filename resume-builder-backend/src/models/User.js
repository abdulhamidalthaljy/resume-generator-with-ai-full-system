const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    title: String,
    personalDetails: {
        name: String,
        birthDate: String,
        address: String,
        familyStatus: String,
        email: String,
        phone: String,
        nationality: String,
        itSkills: String,
        strengths: String,
        imageUrl: String
    },
    informationSummary: String,
    languages: [{
        name: String,
        level: String
    }],
    workExperience: [{
        position: String,
        company: String,
        startDate: String,
        endDate: String,
        description: String
    }],
    workshops: [{
        name: String,
        date: String,
        description: String
    }],
    education: [{
        institution: String,
        degree: String,
        startDate: String,
        endDate: String,
        description: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: String,
    resumes: [ResumeSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
    User: mongoose.model('User', userSchema)
};