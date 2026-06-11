import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export const analyzeResumeWithAI = async (resumeUrl, jobDetails) => {
    try {
        // 1. Download the file from Cloudinary as a buffer
        const response = await axios.get(resumeUrl, { responseType: 'arraybuffer' });
        const pdfBuffer = response.data;

        let resumeText = '';

        // 2. Try to extract text assuming it's a real valid PDF
        try {
            const pdfData = await pdfParse(pdfBuffer);
            resumeText = pdfData.text;
        } catch (parseError) {
            // FALLBACK: If the file lacks PDF headers (like our test file),
            // safely read it as standard raw text.
            console.log('[AI Service] Invalid PDF structure detected. Falling back to raw text extraction...');
            resumeText = pdfBuffer.toString('utf-8');
        }

        if (!resumeText || resumeText.trim().length === 0) {
            throw new Error('Could not extract text from the provided document.');
        }

        // 3. Initialize Gemini API
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // UPGRADED TO 2.5 FLASH TO SUPPORT NEW GOOGLE API KEYS
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 4. Create the prompt strictly asking for JSON
        const prompt = `
            You are an expert ATS (Applicant Tracking System) and Senior Tech Recruiter.
            Analyze the following resume against the provided job description.
            
            Job Title: ${jobDetails.title}
            Job Description: ${jobDetails.description}
            Required Skills: ${jobDetails.skills.join(', ')}
            
            Candidate Resume Text:
            ${resumeText}
            
            You must respond ONLY with a valid, parsable JSON object. Do not include markdown formatting like \`\`\`json.
            Use this exact JSON structure:
            {
                "atsScore": <number between 1 and 100>,
                "resumeSummary": "<string: brief 2 sentence summary of candidate>",
                "missingSkills": ["<skill 1>", "<skill 2>"],
                "resumeStrengths": ["<strength 1>", "<strength 2>"],
                "resumeWeaknesses": ["<weakness 1>", "<weakness 2>"],
                "suggestedImprovements": ["<improvement 1>", "<improvement 2>"]
            }
        `;

        // 5. Send to Gemini
        const result = await model.generateContent(prompt);
        let aiResponse = result.response.text();

        // 6. Clean up the response (case-insensitive for reliability)
        aiResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();

        // 7. Parse and return the JSON
        const parsedData = JSON.parse(aiResponse);
        return parsedData;

    } catch (error) {
        console.error('AI Service Error:', error.message);
        throw new Error(`Failed to analyze resume with AI. ${error.message}`);
    }
};