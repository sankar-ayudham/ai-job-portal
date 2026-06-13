import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import ErrorResponse from '../utils/errorResponse.js';

export const protect = catchAsync(async (req, res, next) => {
    let token;

    // METHOD 1: Check the Authorization Header (Bearer Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        
        // Prevent the literal string "undefined" from slipping through
        if (token === 'undefined' || token === 'null') {
            token = null;
        }
    } 
    // METHOD 2: Check the Cookies (If your backend sends HTTP-only cookies)
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // If neither method found a token, block the request immediately
    if (!token) {
        console.log('🚨 AUTH ERROR: Request blocked. No token found in Headers or Cookies.');
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // 🚀 THE FIX: Use JWT_ACCESS_SECRET exactly as it is named in your .env file
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Extract the ID (checking both standard formats)
        const userId = decoded.id || decoded._id;
        
        // Find the user and attach them to the request
        req.user = await User.findById(userId);

        if (!req.user) {
            console.log('🚨 AUTH ERROR: Token is valid, but the user no longer exists in the database.');
            return next(new ErrorResponse('The user belonging to this token no longer exists.', 401));
        }

        // Success! Allow the request to proceed to the controller
        next();
        
    } catch (err) {
        console.log(`🚨 AUTH ERROR: Token verification failed: ${err.message}`);
        return next(new ErrorResponse('Not authorized to access this route. Invalid token.', 401));
    }
});