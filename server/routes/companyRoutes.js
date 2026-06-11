import express from 'express';
import { createCompany } from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

router.route('/')
    .post(authorize('Recruiter', 'Admin'), createCompany);

export default router;