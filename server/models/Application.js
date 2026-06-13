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
        required: [true, 'Please provide a resume URL']
    },
    atsScore: { type: Number, default: 0 },
    aiAnalysis: { type: Object, default: {} },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Rejected', 'Accepted'],
        default: 'Pending'
    }
}, { timestamps: true });

// 1. Create the CORRECT unique index so a user can't apply to the same job twice
applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

// 2. THE GHOST BUSTER: This tells MongoDB to silently delete the old, broken index
Application.collection.dropIndex('candidate_1_job_1').catch(() => {
    // We catch the error silently so it doesn't clutter your console if the index is already gone
});

export default Application;