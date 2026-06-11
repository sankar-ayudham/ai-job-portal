import express from 'express';
import { createApplication, getMyApplications, getJobApplicants } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Candidate Routes
router.get('/me', protect, authorize('Candidate'), getMyApplications);
router.post('/', protect, authorize('Candidate'), createApplication);

// Recruiter Routes (Get applicants for a specific job)
router.get('/job/:jobId', protect, authorize('Recruiter'), getJobApplicants);

export default router;