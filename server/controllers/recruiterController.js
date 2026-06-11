import Application from '../models/Application.js';
import Job from '../models/Job.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Get all applications for jobs posted by the logged-in recruiter
// @route   GET /api/recruiter/applications
export const getRecruiterApplications = catchAsync(async (req, res) => {
    // 1. Find all jobs posted by the currently logged-in recruiter
    const recruiterJobs = await Job.find({ postedBy: req.user._id });
    const jobIds = recruiterJobs.map(job => job._id);

    // 2. Find all applications tied to those specific jobs
    const applications = await Application.find({ job: { $in: jobIds } })
        .populate('job', 'title') // Include the job title
        .populate('applicant', 'name email'); // Include the candidate's name and email

    res.status(200).json({ 
        success: true, 
        count: applications.length, 
        data: applications 
    });
});