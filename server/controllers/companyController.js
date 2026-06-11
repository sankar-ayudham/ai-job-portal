import Company from '../models/Company.js';
import catchAsync from '../utils/catchAsync.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Create a new company profile
// @route   POST /api/companies
// @access  Private (Recruiter, Admin)
export const createCompany = catchAsync(async (req, res, next) => {
    // Automatically assign the logged-in user to the company
    req.body.user = req.user.id;

    // Check if this recruiter already has a company profile
    const existingCompany = await Company.findOne({ user: req.user.id });

    if (existingCompany && req.user.role !== 'Admin') {
        return next(new ErrorResponse('Recruiter can only create one company profile', 400));
    }

    const company = await Company.create(req.body);

    res.status(201).json({
        success: true,
        data: company
    });
});