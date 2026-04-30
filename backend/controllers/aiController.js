import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import fs from "fs";
import mammoth from "mammoth";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import { runAI } from "../services/aiService.js";

const SEEKER_PROMPT = `You are RecruiteX AI, a professional career coach for Job Seekers on the RecruiteX portal. 
Your goal is to help candidates find jobs, improve their resumes, prepare for interviews, and provide career advice. 
Always be encouraging, professional, and focus on candidate success. 
Keep responses concise and formatted as clean text.`;

const RECRUITER_PROMPT = `You are RecruiteX AI, a professional recruitment consultant for Employers on the RecruiteX portal. 
Your goal is to help recruiters find the best talent, optimize job descriptions, manage applications, and provide hiring market insights. 
Always be efficient, professional, and focus on streamlining the hiring process. 
Keep responses concise and formatted as clean text.`;

// Helper to extract JSON from AI response
const extractJSON = (text) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON Parse Error:", error.message);
    return null;
  }
};

export const chatBotController = catchAsyncErrors(async (req, res, next) => {
  const { message, role } = req.body;
  if (!message) return next(new ErrorHandler("Message is required", 400));
  
  // Select prompt based on role
  const selectedPrompt = role === "Employer" ? RECRUITER_PROMPT : SEEKER_PROMPT;

  try {
    const replyText = await runAI(message, selectedPrompt);
    const reply = { response: replyText };
    res.status(200).json({ success: true, reply });
  } catch (error) {
    const reply = { response: error.message };
    res.status(200).json({ success: true, reply });
  }
});

export const analyzeResumeController = catchAsyncErrors(async (req, res, next) => {
  let { resumeText } = req.body;

  if (!resumeText && req.files && req.files.resume) {
    const file = req.files.resume;
    const fileBuffer = file.tempFilePath ? fs.readFileSync(file.tempFilePath) : file.data;
    
    if (file.mimetype === "application/pdf") {
        try {
            const data = await pdf(fileBuffer);
            resumeText = data.text;
        } catch (err) {
            return next(new ErrorHandler("Could not parse PDF. Please ensure it's not a scanned image.", 400));
        }
    } else if (file.name?.endsWith(".docx") || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        try {
            const docxData = await mammoth.extractRawText({ buffer: fileBuffer });
            resumeText = docxData.value;
        } catch (err) {
            return next(new ErrorHandler("Could not parse Word document.", 400));
        }
    } else {
        resumeText = fileBuffer.toString("utf8");
    }
  }

  if (!resumeText) return next(new ErrorHandler("Resume text is required", 400));
  
  try {
    const prompt = `Analyze this resume text and provide a professional ATS report.
    Resume Text: "${resumeText.slice(0, 4000)}"
    
    Return ONLY a JSON object with this exact structure:
    {
      "score": number (0-100),
      "skills": ["skill1", "skill2", ...],
      "improvements": ["tip1", "tip2", ...],
      "missing_keywords": ["keyword1", "keyword2", ...]
    }`;

    const aiResponse = await runAI(prompt, "You are an expert ATS (Applicant Tracking System) analyzer. Return only valid JSON.");
    const parsedReply = extractJSON(aiResponse);

    if (parsedReply) {
      return res.status(200).json({ success: true, reply: parsedReply });
    }
    throw new Error("Invalid AI response format");

  } catch (error) {
    console.warn("AI Analysis failed, using fallback logic:", error.message);
    // Fallback to basic logic if AI fails
    const textLower = resumeText.toLowerCase();
    let score = 55;
    const skillsFound = [];
    const keywords = ["javascript", "react", "node", "python", "java", "sql", "aws", "docker", "mongodb"];
    keywords.forEach(kw => { if (textLower.includes(kw)) { skillsFound.push(kw); score += 4; } });
    
    const reply = {
      score: Math.min(score, 90),
      skills: skillsFound.length > 0 ? skillsFound : ["General Professional Skills"],
      improvements: ["Use more action verbs", "Quantify your achievements", "Add more specific tech keywords"],
      missing_keywords: keywords.filter(kw => !skillsFound.includes(kw)).slice(0, 3)
    };
    res.status(200).json({ success: true, reply });
  }
});

export const matchSkillController = catchAsyncErrors(async (req, res, next) => {
  const { skills, jobDescription } = req.body;
  if (!skills || !jobDescription) return next(new ErrorHandler("Skills and job description are required", 400));
  
  try {
    const prompt = `Match the user's skills with the job description.
    User Skills: "${skills}"
    Job Description: "${jobDescription.slice(0, 2000)}"
    
    Return ONLY a JSON object with this exact structure:
    {
      "matchScore": number (0-100),
      "strengths": ["match1", "match2", ...],
      "gaps": ["missing1", "missing2", ...],
      "recommendation": "Short professional advice string"
    }`;

    const aiResponse = await runAI(prompt, "You are a professional recruiter. Return only valid JSON.");
    const parsedReply = extractJSON(aiResponse);

    if (parsedReply) {
      return res.status(200).json({ success: true, reply: parsedReply });
    }
    throw new Error("Invalid AI response format");

  } catch (error) {
    console.warn("AI Match failed, using fallback logic:", error.message);
    const jobDescLower = jobDescription.toLowerCase();
    const userSkillsArray = skills.split(",").map(s => s.trim());
    const strengths = [];
    const gaps = [];
    userSkillsArray.forEach(skill => {
      if (skill.length > 0 && jobDescLower.includes(skill.toLowerCase())) strengths.push(skill);
      else if (skill.length > 0) gaps.push(skill);
    });
    
    const reply = {
      matchScore: strengths.length > 0 ? 60 : 30,
      strengths: strengths.length > 0 ? strengths : ["Basic profile match"],
      gaps: gaps.slice(0, 3),
      recommendation: "Consider tailoring your profile to highlight relevant experience."
    };
    res.status(200).json({ success: true, reply });
  }
});

