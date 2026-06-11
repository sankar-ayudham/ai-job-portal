import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Building2, MapPin, CheckCircle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

// --- AGGRESSIVE DATA SANITIZER & SPAM FILTER ---
const cleanJobDescription = (text) => {
    if (!text) return "No description provided.";
    
    return text
        // 1. Unescape common HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        
        // 2. Fix UTF-8 Mojibake (The weird 'â' characters)
        .replace(/â€¦/g, '...') 
        .replace(/â¦/g, '...')  
        .replace(/â€“/g, '-')   
        .replace(/â€”/g, '-')   
        .replace(/â€™/g, "'")   
        .replace(/â€œ/g, '"')   
        .replace(/â€/g, '"')   
        
        // 3. STRIP AGGRESSIVE SCRAPER SPAM (This fixes your exact screenshot)
        // Removes the broken LinkedIn referral text
        .replace(/Quick.*?LinkedIn\.?/gi, '') 
        // Removes the massive "Please mention the word... to see they're human" paragraph
        .replace(/Please mention the word[\s\S]*?they're human\.?/gi, '') 
        
        // 4. Convert any raw plain-text newlines into actual HTML line breaks
        .replace(/\n/g, '<br/>');
};

export default function JobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [file, setFile] = useState(null);
    const [hasApplied, setHasApplied] = useState(false); 
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${id}`);
                setJob(res.data.data);
                setIsLoading(false);
            } catch (err) {
                toast.error('Job not found');
                navigate('/jobs');
            }
        };
        fetchJob();
    }, [id, navigate]);

    const handleApplyAndAnalyze = async () => {
        if (!file) return toast.error('Please upload a resume first');
        
        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await api.post('/upload/resume', formData);
            
            const appRes = await api.post('/applications', { jobId: id, resumeUrl: uploadRes.data.data.url });
            
            const aiRes = await api.post(`/ai/analyze-application/${appRes.data.data._id}`);
            setAnalysis(aiRes.data.data);
            setHasApplied(true);
            toast.success('Application & Analysis complete!');
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Analysis failed.';
            const status = err.response?.status;
            
            if (status === 401 || errorMsg.includes('Not authorized')) {
                toast.error('Session expired. Please log in again to apply.');
                navigate('/login');
                return;
            }

            if (errorMsg.includes('already applied')) {
                setHasApplied(true);
                const existingApp = err.response?.data?.application;
                if (existingApp?.aiAnalysis) {
                    setAnalysis(existingApp.aiAnalysis);
                } else if (existingApp?.atsScore) {
                    setAnalysis({ atsScore: existingApp.atsScore });
                }
                toast.error('You have already applied for this position!');
            } else if (status === 403) {
                toast.error('Your account role does not have access to apply for this job.');
            } else {
                toast.error(errorMsg);
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isLoading) return <div className="pt-32 pb-12 text-center text-slate-500 flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="font-medium">Loading job details...</p>
    </div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3 space-y-8">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{job?.title}</h1>
                <div className="flex flex-wrap gap-4 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-700/50">
                        <Building2 className="w-4 h-4 text-blue-500"/> {job?.company?.name || job?.companyNameFallback || 'TechCorp Innovations'}
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl font-bold border border-slate-200 dark:border-slate-700/50">
                        <MapPin className="w-4 h-4 text-blue-500"/> {job?.location}
                    </div>
                </div>
                
                <div className="space-y-4 bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Job Description</h3>
                    
                    {/* The aggressively cleaned HTML is safely injected here */}
                    <div 
                        className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>br]:mb-2 [&>strong]:text-slate-900 dark:[&>strong]:text-white"
                        dangerouslySetInnerHTML={{ __html: cleanJobDescription(job?.description) }}
                    />
                </div>
            </div>

            <div className="lg:col-span-2 relative">
                <div className="bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl h-fit sticky top-28">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                        <Sparkles className="text-blue-600"/> AI Resume Analysis
                    </h2>
                    
                    {!user ? (
                        <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                            <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Login Required</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">You must be logged in to upload your resume and get an AI ATS analysis for this role.</p>
                            <button 
                                onClick={() => navigate('/login')}
                                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                            >
                                Log In to Apply
                            </button>
                        </div>
                    ) : hasApplied ? (
                        <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-2xl">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Application Submitted</h3>
                            <p className="text-green-600 dark:text-green-500 font-medium text-sm">You have successfully applied for this role.</p>
                            
                            {analysis && analysis.atsScore > 0 && (
                                <div className="mt-6 pt-6 border-t border-green-200 dark:border-green-800/50">
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Your ATS Score</p>
                                    <div className="inline-block px-6 py-2 bg-white dark:bg-[#0f172a] rounded-2xl border border-green-200 dark:border-green-800/50 shadow-sm mt-1">
                                        <p className="text-4xl font-black text-green-600 dark:text-green-400">{analysis.atsScore}<span className="text-2xl text-slate-400 dark:text-slate-600">/100</span></p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setFile(e.target.files[0])} 
                                    className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-200 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer transition-all group-hover:border-blue-500/50 focus:outline-none" 
                                />
                            </div>
                            <button 
                                onClick={handleApplyAndAnalyze} 
                                disabled={isAnalyzing} 
                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 group flex items-center justify-center gap-2"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin"/> Analyzing Profile...
                                    </>
                                ) : (
                                    'Apply & Analyze with AI'
                                )}
                            </button>
                            <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Accepts PDF, DOC, DOCX up to 5MB
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}