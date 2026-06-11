import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Application Status', 'New Job Match', 'System Alert'],
        default: 'System Alert'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId, // Could be a Job ID or Application ID
        default: null
    }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);