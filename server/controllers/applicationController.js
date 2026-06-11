import Application from '../models/Application.js';
import Job from '../models/Job.js';
import catchAsync from '../utils/catchAsync.js';
import ErrorResponse from '../utils/errorResponse.js';

export const createApplication = catchAsync(async (req, res, next) => {
    const { jobId, resumeUrl } = req.body;

    if (!jobId || !resumeUrl) {
        return next(new ErrorResponse('Job ID and Resume URL are required', 400));
    }

    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
        return next(new ErrorResponse('Job not found', 404));
    }

    const existingApp = await Application.findOne({
        job: jobId,
        applicant: req.user._id
    });

    if (existingApp) {
        return res.status(400).json({ 
            success: false, 
            error: 'You have already applied for this job',
            application: existingApp
        });
    }

    const application = await Application.create({
        job: jobId,
        applicant: req.user._id,
        resumeUrl,
        status: 'Pending'
    });

    res.status(201).json({ success: true, data: application });
});

export const getMyApplications = catchAsync(async (req, res, next) => {
    const applications = await Application.find({ applicant: req.user._id })
        .populate('job', 'title company location')
        .sort('-createdAt');

    res.status(200).json({ success: true, count: applications.length, data: applications });
});

// NEW: For Recruiters to see who applied to a specific job
export const getJobApplicants = catchAsync(async (req, res, next) => {
    const { jobId } = req.params;

    // Verify the job exists
    const job = await Job.findById(jobId);
    if (!job) {
        return next(new ErrorResponse('Job not found', 404));
    }

    // Find all applications for this job, populate user details, and sort by ATS score (Highest first!)
    const applications = await Application.find({ job: jobId })
        .populate('applicant', 'name email')
        .sort({ atsScore: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
});