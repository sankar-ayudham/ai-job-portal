import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a job title'],
        trim: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company' // Removed required: true to allow external jobs
    },
    companyNameFallback: {
        type: String // Stores the name of external companies
    },
    description: {
        type: String,
        required: [true, 'Please provide a job description']
    },
    requirements: {
        type: [String],
        default: []
    },
    responsibilities: {
        type: [String],
        default: []
    },
    salary: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' }
    },
    location: {
        type: String,
        required: [true, 'Please provide job location']
    },
    experienceLevel: {
        type: String,
        enum: ['Fresher', 'Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'],
        default: 'Mid Level'
    },
    employmentType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
        default: 'Full-time'
    },
    skills: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // --- NEW AGGREGATION FIELDS ---
    externalId: { type: String, unique: true, sparse: true }, // Prevents saving the same external job twice
    source: { type: String, default: 'Internal' }, // e.g., 'RemoteOK'
    applyUrl: { type: String } // Link to external application
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);