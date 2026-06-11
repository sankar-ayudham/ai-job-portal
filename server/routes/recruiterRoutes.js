import express from 'express';
import { getRecruiterApplications } from '../controllers/recruiterController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get applications for a recruiter's dashboard
// Protected: Only logged-in users with the 'Recruiter' role can access
router.route('/applications')
    .get(protect, authorize('Recruiter'), getRecruiterApplications);

export default router;