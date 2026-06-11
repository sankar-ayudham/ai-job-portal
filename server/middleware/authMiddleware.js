import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

// Protect routes - Verifies the token
export const protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return next(new ErrorResponse('The user belonging to this token no longer exists', 401));
        }
        next();
    } catch (error) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Authorize roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                error: `User role '${req.user.role}' is not authorized to access this route` 
            });
        }
        next();
    };
};