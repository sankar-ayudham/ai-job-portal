import ErrorResponse from '../utils/errorResponse.js';

// Fallback for routes that don't exist
export const notFound = (req, res, next) => {
    const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev debugging
    console.error(`[Error] ${err}`);

    // Mongoose bad ObjectId (e.g., searching for a job with an invalid ID format)
    if (err.name === 'CastError') {
        const message = `Resource not found with ID: ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key (e.g., registering with an email that already exists)
    if (err.code === 11000) {
        const message = 'Duplicate field value entered. This record already exists.';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error (e.g., missing a required field like 'password')
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ErrorResponse(message, 400);
    }

    // Send the final formatted response
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};