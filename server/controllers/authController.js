import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';

// Helper function to generate JWT, attach to cookie, and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_ACCESS_SECRET, 
        { expiresIn: '30d' }
    );

    // Secure cookie options
    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    };

    res.status(statusCode).cookie('accessToken', token, options).json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ success: false, error: 'Email is already registered' });
    }

    // Create user
    const user = await User.create({ name, email, password, role });
    
    sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user (must use .select('+password') because we hid it in the schema)
    const user = await User.findOne({ email }).select('+password');
    
    // FIXED: Return a direct 401 JSON response instead of throwing an unhandled error
    if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
export const logout = catchAsync(async (req, res, next) => {
    res.cookie('accessToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
        httpOnly: true
    });
    
    res.status(200).json({ success: true, data: {} });
});