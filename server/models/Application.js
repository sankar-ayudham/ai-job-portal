import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Interviewing', 'Rejected', 'Accepted'],
        default: 'Pending'
    },
    atsScore: {
        type: Number,
        default: 0
    },
    aiAnalysis: {
        type: Object,
        default: null
    }
}, { timestamps: true });

// DB Level protection against duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);