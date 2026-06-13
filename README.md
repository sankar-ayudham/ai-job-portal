# 🚀 AI Job Portal & ATS Analyzer

![Project Banner](./placeholders/banner.png)

## 📖 Overview
The **AI Job Portal** is a full-stack MERN application designed to modernize the hiring process. It bridges the gap between recruiters and candidates by utilizing **Generative AI (LLMs)** to provide real-time Applicant Tracking System (ATS) scoring, resume optimization, and automated candidate ranking. 

Whether you are a recruiter looking for the perfect match or a candidate trying to bypass rigid ATS filters, this platform provides intelligent, data-driven insights.

---

## 🎯 Problem Statement
1. **For Candidates:** Modern ATS algorithms blindly reject highly qualified candidates due to poor resume formatting or missing keywords. Candidates often lack feedback on *why* they were rejected.
2. **For Recruiters:** HR professionals are overwhelmed with hundreds of unqualified applications and spend too much time manually parsing PDFs to find relevant skills.

## 💡 Solution
- **AI-Powered ATS Matcher:** Instantly compares candidate resumes against job descriptions, yielding a match percentage and skill gap analysis.
- **AI Resume Builder:** Takes rough candidate notes and uses LLMs to rewrite them into highly professional, ATS-optimized bullet points.
- **Smart Recruiter Dashboard:** Automatically ranks incoming applications by their AI-generated ATS score, pushing the best candidates to the top of the pipeline.

---

## ✨ Features

### 🏢 Recruiter Features
- **Job Management:** Post, edit, and manage job listings with strict schema validation (min/max salary, employment types).
- **Intelligent Dashboard:** View active jobs and monitor the applicant pipeline.
- **AI Candidate Ranking:** Applicants are automatically sorted by their ATS match score, saving hours of manual review.
- **Resume Viewer:** Instant access to candidate PDFs securely hosted on the cloud.

### 👨‍💻 Candidate Features
- **Advanced Job Search:** Filter active jobs by keywords, location, and employment type.
- **Application Tracking:** A personalized dashboard to track application status and view historical ATS scores.
- **AI Resume Builder:** A side-by-side workspace where candidates input raw experience notes and the AI formats them into professional JSON-structured bullet points.
- **Resume Uploading:** Seamless PDF uploading parsed securely for backend AI analysis.

### 🎨 UI/UX Features
- **Tailwind CSS v4:** Modern, sleek interface with a fully custom, class-based Dark Mode implementation.
- **Fully Responsive:** Optimized for desktop, tablet, and mobile viewing.
- **Glassmorphism & Micro-interactions:** Premium feel utilizing `lucide-react` icons and smooth CSS transitions.

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS v4 | High-performance UI and utility-first styling. |
| **Backend** | Node.js, Express.js | RESTful API architecture and server logic. |
| **Database** | MongoDB, Mongoose | NoSQL database for flexible data modeling. |
| **AI Engine** | Groq API (LLaMA 3 8B) | High-speed LLM for resume parsing and bullet point optimization. |
| **Storage** | Cloudinary | Secure cloud storage for applicant PDF resumes. |
| **Auth & Security**| JSON Web Tokens (JWT), bcrypt.js | Secure user authentication and password hashing. |

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[React Frontend] -->|REST API calls| Server[Node/Express Backend]
    Server -->|Read/Write Data| DB[(MongoDB)]
    Server -->|Send Prompts| AI[Groq API LLaMA 3]
    Client -->|Upload PDFs| Cloud[Cloudinary]
    AI -->|Return JSON| Server
    Cloud -->|Secure URL| Server