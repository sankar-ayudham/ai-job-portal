import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['emailVerification', 'passwordReset'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Document automatically deletes itself after 1 hour (3600 seconds)
    }
});

export default mongoose.model('Token', tokenSchema);