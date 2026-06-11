import express from 'express';
import { getJobs, getJob, createJob } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs (public, handles search & pagination)
router.get('/', getJobs);

// @route   GET /api/jobs/:id
// @desc    Get single job details (public)
router.get('/:id', getJob);

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Protected: Only Recruiters can post jobs
router.post('/', protect, authorize('Recruiter'), createJob);

export default router;