import { uploadToCloudinary } from '../utils/cloudinary.js';
import catchAsync from '../utils/catchAsync.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Upload a resume (PDF)
// @route   POST /api/upload/resume
// @access  Private
export const uploadResume = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('Please upload a file', 400));
    }

    const result = await uploadToCloudinary(req.file.path, 'resumes');
    
    if (!result) {
        return next(new ErrorResponse('Error uploading file to cloud storage', 500));
    }

    res.status(200).json({
        success: true,
        message: 'Resume uploaded successfully',
        data: {
            url: result.secure_url,
            publicId: result.public_id
        }
    });
});

// @desc    Upload an image (Logo/Profile Pic)
// @route   POST /api/upload/image
// @access  Private
export const uploadImage = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('Please upload an image', 400));
    }

    const result = await uploadToCloudinary(req.file.path, 'images');
    
    if (!result) {
        return next(new ErrorResponse('Error uploading image to cloud storage', 500));
    }

    res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
            url: result.secure_url,
            publicId: result.public_id
        }
    });
});