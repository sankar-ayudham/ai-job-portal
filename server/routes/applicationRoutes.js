import express from 'express';
import { 
    createApplication, 
    getMyApplications, 
    getJobApplications 
} from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// 🚀 PROTECTED: Candidates applying for jobs and viewing their own applications
router.route('/')
    .post(protect, createApplication)
    .get(protect, getMyApplications);

// 🚀 PROTECTED: Recruiters viewing applications for a specific job they posted
router.route('/job/:jobId')
    .get(protect, getJobApplications);

export default router;