import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // The recruiter who created the company profile
    },
    name: {
        type: String,
        required: [true, 'Please provide a company name'],
        trim: true,
        unique: true
    },
    logoUrl: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },
    website: { type: String, default: '' },
    location: {
        type: String,
        required: [true, 'Please provide company location']
    },
    description: {
        type: String,
        required: [true, 'Please provide company description'],
        maxLength: 1000
    },
    industry: {
        type: String,
        required: [true, 'Please provide the industry type']
    },
    employeesCount: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
        default: '1-10'
    },
    foundedYear: { type: Number }
}, { timestamps: true });

export default mongoose.model('Company', companySchema);