import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import ErrorResponse from '../utils/errorResponse.js';

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    // FIXED: Ensure expires is a valid Date object, even if .env is missing/malformed
    const cookieExpireDays = parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 30;
    const options = {
        expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // 1. Create the user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // 2. Safe Token Generation with Rollback
    try {
        sendTokenResponse(user, 200, res);
    } catch (error) {
        // Rollback: if token fails, delete the user so they can register again later
        await User.findByIdAndDelete(user._id);
        console.error("Token Generation Error:", error);
        return next(new ErrorResponse('Registration failed. Please try again.', 500));
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = catchAsync(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});