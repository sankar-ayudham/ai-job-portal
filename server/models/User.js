import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false // Prevents the password from being returned in standard queries
    },
    role: {
        type: String,
        enum: ['Candidate', 'Recruiter'],
        default: 'Candidate'
    }
}, { timestamps: true });

// 1. Mongoose Middleware: Encrypt password using bcrypt before saving
userSchema.pre('save', async function(next) {
    // If the password hasn't been changed, skip hashing
    if (!this.isModified('password')) {
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 2. Instance Method: Sign JWT and return it

userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_SECRET, { // Changed to JWT_ACCESS_SECRET
        expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' // Changed to JWT_ACCESS_EXPIRE
    });
};

// 3. Instance Method: Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);