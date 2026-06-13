import express from 'express';
import { analyzeApplication, optimizeResumeText } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ATS Scanner Route (Keep this protected so only logged-in users can apply)
router.post('/analyze-application/:id', protect, analyzeApplication);

// Resume Text Optimizer Route (REMOVED 'protect' to make it a public tool)
router.post('/optimize', optimizeResumeText);

export default router;