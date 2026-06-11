import express from 'express';
import { analyzeApplication, optimizeResumeText } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Existing ATS Scanner Route
router.post('/analyze-application/:id', protect, analyzeApplication);

// NEW: Resume Text Optimizer Route
router.post('/optimize', protect, optimizeResumeText);

export default router;