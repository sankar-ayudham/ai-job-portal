import Application from '../models/Application.js';
import Job from '../models/Job.js';
import catchAsync from '../utils/catchAsync.js';
import ErrorResponse from '../utils/errorResponse.js';
import OpenAI from 'openai';
import PDFParser from 'pdf2json';

// --- THE HEAVY-DUTY SILENCER ---
const originalWarn = console.warn;
const originalLog = console.log;

const checkAndSilence = (args, originalFn) => {
    // Convert whatever weird format the library is using into a flat string
    const logString = args.map(arg => {
        try { return typeof arg === 'object' ? JSON.stringify(arg) : String(arg); } 
        catch (e) { return ''; }
    }).join(' ');

    // If it contains the annoying phrases, kill it immediately
    if (
        logString.includes('Setting up fake worker') ||
        logString.includes('Unsupported: field.type') ||
        logString.includes('NOT valid form element')
    ) {
        return; 
    }
    // Otherwise, print it normally
    originalFn(...args);
};

// Override both warn and log globally for this file
console.warn = (...args) => checkAndSilence(args, originalWarn);
console.log = (...args) => checkAndSilence(args, originalLog);
// --------------------------------

// Helper function: Fetch PDF from Cloudinary URL and extract text using pdf2json
const extractTextFromPDF = async (pdfUrl) => {
    try {
        const response = await fetch(pdfUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        return new Promise((resolve, reject) => {
            const pdfParser = new PDFParser(null, { silent: true });
            
            pdfParser.on("pdfParser_dataError", errData => {
                console.error("PDF2JSON Error:", errData.parserError);
                reject(new Error("Failed to parse the PDF document."));
            });
            
            pdfParser.on("pdfParser_dataReady", () => {
                const text = decodeURIComponent(pdfParser.getRawTextContent());
                resolve(text);
            });
            
            pdfParser.parseBuffer(buffer);
        });
        
    } catch (error) {
        console.error("PDF Fetch Error:", error);
        throw new Error('Could not download or read the uploaded resume.');
    }
};

// --- REAL AI ENGINE: ATS Resume Scoring (via Groq/OpenAI) ---
export const analyzeApplication = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id || id === 'undefined') {
        return next(new ErrorResponse('Invalid Application ID passed from frontend', 400));
    }

    const application = await Application.findById(id).populate('job');

    if (!application) {
        return next(new ErrorResponse(`Application not found with id: ${id}`, 404));
    }

    try {
        // 1. Extract text from the candidate's uploaded PDF
        const resumeText = await extractTextFromPDF(application.resumeUrl);
        
        // 2. Safely extract Job variables
        const jobTitle = application.job ? application.job.title : "Unknown Job";
        const jobDescription = application.job ? application.job.description : "No description provided";

        // 3. Initialize Groq
        const aiClient = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1" 
        });

        // 4. Ask Groq to score the resume against the job
        const response = await aiClient.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }, // FORCES API TO RETURN JSON
            messages: [
                {
                    role: "system",
                    content: `You are an expert, strict Applicant Tracking System (ATS).
                    Compare the candidate's Resume Text against the Job Description.
                    
                    CRITICAL INSTRUCTION 1: Be brutal and honest. If the resume has absolutely nothing to do with the job, give them a score between 10 and 30. Only give 80+ if they are a genuine, strong match.
                    CRITICAL INSTRUCTION 2: Return ONLY a valid JSON object. No other text.
                    
                    Use this exact JSON schema:
                    {
                        "atsScore": Number (0-100 overall match),
                        "breakdown": {
                            "skillsScore": Number (0-100),
                            "experienceScore": Number (0-100),
                            "formattingScore": Number (0-100),
                            "keywordScore": Number (0-100)
                        },
                        "strengths": ["Array of 2-3 brief string points"],
                        "weaknesses": ["Array of 2-3 brief string points explaining why they lack the required skills"],
                        "missingKeywords": ["Array of 3-5 specific keywords the resume lacks"],
                        "atsPrediction": "High Probability" | "Medium Probability" | "Low Probability"
                    }`
                },
                {
                    role: "user",
                    content: `Job Title: "${jobTitle}"\nJob Description: "${jobDescription.substring(0, 3000)}"\nResume Text: "${resumeText.substring(0, 3000)}"`
                }
            ],
            temperature: 0.1 
        });

        // 5. BULLETPROOF PARSING: Rip out only the JSON object
        const responseText = response.choices[0].message.content;
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("AI failed to generate a JSON structure.");
        }
        
        const cleanedText = responseText.substring(firstBrace, lastBrace + 1);
        const analysisData = JSON.parse(cleanedText);

        application.atsScore = analysisData.atsScore;
        application.aiAnalysis = analysisData;
        application.status = 'Reviewed';
        await application.save();

        res.status(200).json({ success: true, data: analysisData });

    } catch (error) {
        console.error("ATS Scoring Error:", error);
        return next(new ErrorResponse('Failed to analyze the resume against the job description.', 500));
    }
});

// --- REAL AI ENGINE: Resume Text Optimizer (via Groq/OpenAI) ---
export const optimizeResumeText = catchAsync(async (req, res, next) => {
    const { rawText, role } = req.body;

    if (!rawText) {
        return next(new ErrorResponse('Please provide raw text to optimize', 400));
    }

    const aiClient = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1" 
    });

    try {
        const response = await aiClient.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are an expert Technical Recruiter and ATS Resume Writer. 
                    Rewrite the user's rough notes into 3 to 4 powerful, quantifiable, ATS-optimized resume bullet points.
                    Focus on action verbs, metrics, and technical impact.
                    CRITICAL: Return ONLY a valid JSON array of strings. Format exactly like this: ["Bullet 1", "Bullet 2", "Bullet 3"]`
                },
                {
                    role: "user",
                    content: `Role: ${role || 'Software Engineering'}\nRaw Notes: ${rawText}`
                }
            ],
            temperature: 0.3
        });

        // BULLETPROOF PARSING: Rip out only the JSON array
        const responseText = response.choices[0].message.content;
        const firstBracket = responseText.indexOf('[');
        const lastBracket = responseText.lastIndexOf(']');
        
        if (firstBracket === -1 || lastBracket === -1) {
             throw new Error("AI failed to generate a JSON array.");
        }

        const cleanedText = responseText.substring(firstBracket, lastBracket + 1);
        const optimizedContent = JSON.parse(cleanedText);

        res.status(200).json({ success: true, data: optimizedContent });
        
    } catch (error) {
        console.error("AI API Error:", error);
        return next(new ErrorResponse('AI Generation failed. Check your API key and try again.', 500));
    }
});