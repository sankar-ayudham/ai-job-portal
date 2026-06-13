import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contact: { name: String, email: String, phone: String, location: String },
    experience: [{ title: String, company: String, duration: String, description: String }],
    education: [{ degree: String, institution: String, year: String }],
    skills: [String],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Resume', resumeSchema);