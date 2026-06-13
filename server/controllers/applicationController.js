import Application from '../models/Application.js';
import Job from '../models/Job.js';
import catchAsync from '../utils/catchAsync.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Apply for a job
// @route   POST /api/applications
export const createApplication = catchAsync(async (req, res, next) => {
    // 1. Security Check: Ensure the user is logged in
    if (!req.user || !req.user.id) {
        return next(new ErrorResponse("Not authorized to apply. Please log in.", 401));
    }

    // 🚀 THE FIX: Prevent server crashes if the frontend forgets the job ID
    if (!req.body.job) {
        return next(new ErrorResponse("Job ID is required to submit an application.", 400));
    }

    // 2. Force the applicant ID to be the securely logged-in user
    req.body.applicant = req.user.id;

    // 3. Prevent duplicate applications
    const existingApplication = await Application.findOne({
        job: req.body.job,
        applicant: req.user.id
    });

    if (existingApplication) {
        return next(new ErrorResponse("You have already applied for this role", 400));
    }

    // 4. Save the application to the database
    const application = await Application.create(req.body);

    res.status(201).json({
        success: true,
        data: application
    });
});

// @desc    Get logged-in user's applications
// @route   GET /api/applications
export const getMyApplications = catchAsync(async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return next(new ErrorResponse("Not authorized", 401));
    }

    const applications = await Application.find({ applicant: req.user.id })
        .populate('job', 'title companyName location employmentType')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
    });
});

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
export const getJobApplications = catchAsync(async (req, res, next) => {
    const applications = await Application.find({ job: req.params.jobId })
        .populate('applicant', 'name email')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
    });
});