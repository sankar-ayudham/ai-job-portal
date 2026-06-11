import Application from '../models/Application.js';
import catchAsync from '../utils/catchAsync.js';
import ErrorResponse from '../utils/errorResponse.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- ATS ENGINE (Still using deterministic scoring until we add PDF parsing) ---
const generateConsistentScore = (idString) => {
    let hash = 0;
    for (let i = 0; i < idString.length; i++) {
        hash = idString.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 26) + 70; 
};

export const analyzeApplication = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id || id === 'undefined') {
        return next(new ErrorResponse('Invalid Application ID passed from frontend', 400));
    }

    const application = await Application.findById(id).populate('job');

    if (!application) {
        return next(new ErrorResponse(`Application not found with id: ${id}`, 404));
    }

    if (application.aiAnalysis && application.atsScore > 0) {
        return res.status(200).json({ success: true, data: application.aiAnalysis });
    }

    const consistentScore = generateConsistentScore(application._id.toString());

    const deterministicAnalysis = {
        atsScore: consistentScore, 
        breakdown: {
            skillsScore: Math.min(consistentScore + 5, 100),
            experienceScore: Math.max(consistentScore - 5, 0),
            formattingScore: 92,
            keywordScore: consistentScore
        },
        strengths: ["Clear formatting", "Good educational foundation"],
        weaknesses: ["Descriptions lack measurable metrics", "Missing a few core technologies"],
        missingKeywords: ["Agile", "CI/CD", "Testing"],
        atsPrediction: consistentScore > 80 ? "High Probability" : "Medium Probability"
    };

    application.atsScore = deterministicAnalysis.atsScore;
    application.aiAnalysis = deterministicAnalysis;
    application.status = 'Reviewed';
    await application.save();

    res.status(200).json({ success: true, data: deterministicAnalysis });
});

// --- REAL AI ENGINE: Resume Text Optimizer ---
export const optimizeResumeText = catchAsync(async (req, res, next) => {
    const { rawText, role } = req.body;
    
    // Helper function with basic retry logic
    const fetchWithRetry = async (retries = 2) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
            const prompt = `...your prompt...`;
            return await model.generateContent(prompt);
        } catch (error) {
            if (error.status === 429 && retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
                return fetchWithRetry(retries - 1);
            }
            throw error;
        }
    };

    const result = await fetchWithRetry();
    // ... rest of your parsing logic ...
});