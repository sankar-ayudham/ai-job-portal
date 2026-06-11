import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();

// Route Imports
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';



const app = express();

// --- CRITICAL MIDDLEWARE ---
app.use(express.json());
app.use(cookieParser()); // Required to read the JWT token from cookies

// Required to allow the frontend to send credentials (cookies) to the backend
app.use(cors({ 
    origin: 'http://localhost:5173', 
    credentials: true 
}));

// --- MOUNT ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/upload', uploadRoutes);

// --- DATABASE CONNECTION & SERVER START ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log(`[Database] MongoDB Connected Successfully`);
        app.listen(PORT, () => {
            console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`[Server] Running on port: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('[Database] MongoDB Connection Error:', error.message);
        process.exit(1);
    });