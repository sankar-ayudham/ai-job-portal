import express from 'express';
import { 
    createJob, 
    getJobs, 
    getJob, 
    getMyJobs 
} from '../controllers/jobController.js'; 
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public & Protected: Get all jobs / Create a new job
router.route('/')
    .get(getJobs)
    .post(protect, createJob);

// 🚀 CRITICAL ROUTE ORDER: /me must come before /:id
router.route('/me')
    .get(protect, getMyJobs);

// Public: Get a single job by its ID
router.route('/:id')
    .get(getJob);

export default router;