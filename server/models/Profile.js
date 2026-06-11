import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    resumeUrl: {
        type: String,
        default: ''
    },
    resumePublicId: {
        type: String,
        default: '' // Used for Cloudinary deletions
    },
    skills: {
        type: [String],
        default: []
    },
    experience: [{
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String }
    }],
    education: [{
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        yearOfPassing: { type: Number, required: true }
    }],
    location: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        maxLength: 500,
        default: ''
    },
    portfolioUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);