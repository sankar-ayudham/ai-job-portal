import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { uploadResume } from '../controllers/uploadController.js'; 
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ensure an 'uploads' directory exists to store files temporarily
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure Multer to save files to the 'uploads' folder
const upload = multer({ dest: 'uploads/' });

// Route to handle resume uploads
// 1. protect: Verifies user is logged in
// 2. authorize: Verifies user is a Candidate
// 3. upload.single('file'): Parses the file from the frontend and attaches it to req.file
router.post('/resume', protect, authorize('Candidate'), upload.single('file'), uploadResume);

export default router;