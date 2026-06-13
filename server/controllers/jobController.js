import Job from '../models/Job.js';
import catchAsync from '../utils/catchAsync.js';
import ErrorResponse from '../utils/errorResponse.js';
import Application from '../models/Application.js';

// @desc    Get all jobs (with advanced search, filter, and pagination)
// @route   GET /api/jobs
export const getJobs = catchAsync(async (req, res, next) => {
    let query;

    // 1. Copy req.query
    const reqQuery = { ...req.query };

    // 2. Fields to exclude from standard matching (handled separately)
    const removeFields = ['keyword', 'page', 'limit', 'employmentType'];
    removeFields.forEach(param => delete reqQuery[param]);

    // 3. Search by Keyword (Matches Title, Description, or Company Name)
    if (req.query.keyword) {
        reqQuery.$or = [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { companyNameFallback: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } }
        ];
    }

    // 4. Filter by Employment Type (if provided)
    if (req.query.employmentType) {
        // If it's a comma-separated list, split it into an array
        const types = req.query.employmentType.split(',');
        reqQuery.employmentType = { $in: types };
    }

    // 5. Build Base Query
    query = Job.find(reqQuery).populate('company', 'name logo');

    // 6. Pagination Logic
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await Job.countDocuments(reqQuery);

    query = query.skip(startIndex).limit(limit).sort('-createdAt');

    // 7. Execute Query
    const jobs = await query;

    // 8. Pagination result calculations
    const pagination = {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalJobs: total
    };

    res.status(200).json({
        success: true,
        count: jobs.length,
        pagination,
        data: jobs
    });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
export const getJob = catchAsync(async (req, res, next) => {
    const job = await Job.findById(req.params.id).populate('company', 'name description');

    if (!job) {
        return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: job });
});

// @desc    Create new job (For Recruiters)
// @route   POST /api/jobs
export const createJob = catchAsync(async (req, res, next) => {
    // Add user to req.body
    req.body.postedBy = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({ success: true, data: job });
});

// @desc    Get recruiter dashboard data (My Jobs + Applications sorted by AI Score)
// @route   GET /api/jobs/recruiter/dashboard
// @access  Private (Recruiter)
export const getRecruiterDashboard = catchAsync(async (req, res, next) => {
    // 1. Find all jobs posted by the logged-in recruiter
    const jobs = await Job.find({ postedBy: req.user.id }).sort('-createdAt').lean();

    // 2. For each job, find all applications and attach them (sorted by best ATS score first)
    const dashboardData = await Promise.all(jobs.map(async (job) => {
        const applications = await Application.find({ job: job._id })
            .populate('user', 'name email') // Optional: populate if you linked users to applications
            .sort({ atsScore: -1 }) // AI Magic: Best matches at the top!
            .lean();
            
        return {
            ...job,
            applicationCount: applications.length,
            applications
        };
    }));

    res.status(200).json({ success: true, data: dashboardData });
});
export const getMyJobs = catchAsync(async (req, res, next) => {
    const jobs = await Job.find({ postedBy: req.user.id }).sort('-createdAt');

    res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
    });
});