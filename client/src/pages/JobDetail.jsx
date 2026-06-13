import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    Building2, MapPin, Briefcase, DollarSign, 
    ArrowLeft, UploadCloud, Loader2, Sparkles, CheckCircle2, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Application & AI State
    const [resumeFile, setResumeFile] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [atsAnalysis, setAtsAnalysis] = useState(null);
    const [applicationStatus, setApplicationStatus] = useState(null); // 'idle', 'uploading', 'analyzing', 'success'

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${id}`);
                setJob(res.data.data);
            } catch (err) {
                toast.error('Failed to load job details');
                navigate('/jobs');
            } finally {
                setIsLoading(false);
            }
        };

        fetchJob();
    }, [id, navigate]);

    const handleApply = async () => {
        if (!resumeFile) return toast.error('Please select a PDF resume first.');
        
        setIsApplying(true);
        try {
            // STEP 1: Upload to Cloudinary (Requires an unauthenticated upload preset in Cloudinary)
            setApplicationStatus('uploading');
            const formData = new FormData();
            formData.append('file', resumeFile);
            
            // NOTE: Replace 'ai_job_portal_preset' with your actual Cloudinary upload preset name
            formData.append('upload_preset', 'ai_job_portal_preset'); 
            
            // NOTE: Replace 'ds3atptwg' with your actual Cloudinary cloud name
            const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/ds3atptwg/upload`, {
                method: 'POST',
                body: formData
            });
            const cloudData = await cloudinaryRes.json();
            
            if (!cloudData.secure_url) throw new Error('Cloudinary upload failed');

            // STEP 2: Create the Application in your database
            setApplicationStatus('analyzing');
            
            // 🚀 THE FIX: Key changed from 'jobId' to 'job' to perfectly match the backend Mongoose validation rule
            const appRes = await api.post('/applications', {
                job: job._id, 
                resumeUrl: cloudData.secure_url
            });
            
            const applicationId = appRes.data.data._id;

            // STEP 3: Trigger the True AI ATS Engine
            const aiRes = await api.post(`/ai/analyze-application/${applicationId}`);
            
            setAtsAnalysis(aiRes.data.data);
            setApplicationStatus('success');
            toast.success('Application submitted and analyzed successfully!');

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Failed to submit application. Please try again.');
            setApplicationStatus('idle');
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="font-bold">Loading job details...</p>
        </div>
    );

    if (!job) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-28 pb-20 transition-colors">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                
                {/* Back Button */}
                <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Jobs
                </Link>

                <div className="grid lg:grid-cols-3 gap-10">
                    
                    {/* LEFT COLUMN: Job Information */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Header Section */}
                        <div className="bg-white dark:bg-[#0f172a] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <div className="relative z-10">
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                                    {job.title}
                                </h1>
                                
                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400 mb-8">
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-slate-800 dark:text-slate-200">
                                        <Building2 className="w-4 h-4 text-blue-500" /> 
                                        {job.company?.name || job.companyNameFallback || 'Confidential Company'}
                                    </span>
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-slate-800 dark:text-slate-200">
                                        <MapPin className="w-4 h-4 text-rose-500" /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-slate-800 dark:text-slate-200">
                                        <Briefcase className="w-4 h-4 text-indigo-500" /> {job.employmentType}
                                    </span>
                                    {job.salary?.min > 0 && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-emerald-700 dark:text-emerald-400 font-bold">
                                            <DollarSign className="w-4 h-4" /> 
                                            {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white dark:bg-[#0f172a] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">About the Role</h2>
                            
                            <div 
                                className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium
                                            [&>p]:mb-5 [&>h3]:text-xl [&>h3]:font-black [&>h3]:text-slate-900 [&>h3]:dark:text-white [&>h3]:mt-8 [&>h3]:mb-4 
                                            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2 [&>div>ul]:list-disc [&>div>ul]:pl-6 [&>div>ul]:space-y-2
                                            [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:font-bold hover:[&_a]:underline"
                                dangerouslySetInnerHTML={{ __html: job.description }}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Application & ATS Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-28">
                            
                            {/* If not logged in */}
                            {!user ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Login Required</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">You must be logged into a candidate account to apply for this position.</p>
                                    <Link to="/login" className="block w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-center">
                                        Login to Apply
                                    </Link>
                                </div>
                            ) : user.role === 'Recruiter' ? (
                                <div className="text-center py-6">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Recruiters cannot apply to jobs.</p>
                                </div>
                            ) : atsAnalysis ? (
                                /* ATS Results Display */
                                <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                                    <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800">
                                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-900 border-4 border-indigo-500 mb-4 shadow-lg shadow-indigo-500/20">
                                            <span className="text-4xl font-black text-slate-900 dark:text-white">{atsAnalysis.atsScore}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">ATS Match Score</h3>
                                        <p className="text-indigo-500 font-bold mt-1">{atsAnalysis.atsPrediction}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Strengths
                                        </h4>
                                        <ul className="space-y-2">
                                            {atsAnalysis.strengths.map((str, i) => (
                                                <li key={i} className="text-sm text-slate-600 dark:text-slate-400 pl-6 relative">
                                                    <span className="absolute left-2 top-2 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    {str}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {atsAnalysis.missingKeywords?.length > 0 && (
                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 text-rose-500 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" /> Missing Keywords
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {atsAnalysis.missingKeywords.map((kw, i) => (
                                                    <span key={i} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-md">
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Application Form */
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Apply Now</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                        Upload your PDF resume to instantly apply and get an AI ATS analysis.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <input 
                                                type="file" 
                                                accept=".pdf"
                                                onChange={(e) => setResumeFile(e.target.files[0])}
                                                className="hidden"
                                                id="resume-upload"
                                            />
                                            <label 
                                                htmlFor="resume-upload"
                                                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                                                    resumeFile 
                                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' 
                                                        : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-indigo-400 dark:hover:border-indigo-500'
                                                }`}
                                            >
                                                {resumeFile ? (
                                                    <>
                                                        <CheckCircle2 className="w-8 h-8 text-indigo-500 mb-2" />
                                                        <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 line-clamp-1 px-4">{resumeFile.name}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Click to upload PDF</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>

                                        <button
                                            onClick={handleApply}
                                            disabled={isApplying || !resumeFile}
                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                                        >
                                            {isApplying ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" /> 
                                                    {applicationStatus === 'uploading' ? 'Uploading PDF...' : 'AI Analyzing Resume...'}
                                                </>
                                            ) : (
                                                <><Sparkles className="w-5 h-5" /> Apply & Analyze</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}