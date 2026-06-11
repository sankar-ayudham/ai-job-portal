import React, { useState, useEffect } from 'react';
import { Briefcase, Users, FileText, Sparkles, Loader2, ExternalLink, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function RecruiterDashboard() {
    const [myJobs, setMyJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);
    const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
    const [user, setUser] = useState(null);

    // 1. Fetch user & their posted jobs
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const fetchMyJobs = async () => {
            try {
                // Fetching jobs where keyword="" (or you could create a specific /api/jobs/me route later)
                // For now, we will just fetch recent jobs to simulate the recruiter's active postings
                const res = await api.get(`/jobs?limit=5`); 
                setMyJobs(res.data.data);
                if (res.data.data.length > 0) {
                    handleSelectJob(res.data.data[0]); // Auto-select the first job
                }
            } catch (err) {
                toast.error('Failed to load your job postings.');
            } finally {
                setIsLoadingJobs(false);
            }
        };

        fetchMyJobs();
    }, []);

    // 2. Fetch applicants when a job is clicked
    const handleSelectJob = async (job) => {
        setSelectedJob(job);
        setIsLoadingApplicants(true);
        try {
            const res = await api.get(`/applications/job/${job._id}`);
            setApplicants(res.data.data);
        } catch (err) {
            toast.error('Failed to load applicants.');
            setApplicants([]);
        } finally {
            setIsLoadingApplicants(false);
        }
    };

    if (isLoadingJobs) return (
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="font-bold">Loading command center...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-28 pb-20 transition-colors">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Recruiter Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                        Review AI-ranked candidates for your active job postings.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 h-[700px]">
                    
                    {/* LEFT PANEL: My Job Postings */}
                    <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-blue-500" />
                            <h2 className="font-bold text-slate-900 dark:text-white text-lg">Active Postings</h2>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {myJobs.length === 0 ? (
                                <p className="text-center text-slate-500 mt-10">No jobs posted yet.</p>
                            ) : (
                                myJobs.map(job => (
                                    <button 
                                        key={job._id}
                                        onClick={() => handleSelectJob(job)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                                            selectedJob?._id === job._id 
                                                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50' 
                                                : 'bg-transparent border-slate-100 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="pr-4">
                                            <h3 className={`font-bold truncate ${selectedJob?._id === job._id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                                                {job.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
                                                {job.location}
                                            </p>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 transition-transform ${selectedJob?._id === job._id ? 'text-blue-500 translate-x-1' : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400'}`} />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: Ranked Applicants */}
                    <div className="lg:col-span-8 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
                        
                        {/* Header for selected job */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                            <div>
                                <h2 className="font-black text-2xl text-slate-900 dark:text-white">
                                    {selectedJob ? selectedJob.title : 'Select a Job'}
                                </h2>
                                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
                                    <Users className="w-4 h-4" /> {applicants.length} Candidates Applied
                                </p>
                            </div>
                        </div>

                        {/* Applicant List */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {isLoadingApplicants ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                                    <p>Loading AI applicant rankings...</p>
                                </div>
                            ) : applicants.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                    <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No applicants yet</p>
                                    <p className="text-sm mt-1">Check back later for new candidates.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* The candidates are already sorted from Highest to Lowest by the backend! */}
                                    {applicants.map((app, index) => (
                                        <div key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700/50 transition-colors gap-4 shadow-sm">
                                            
                                            <div className="flex items-center gap-5">
                                                {/* Rank Badge */}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                                                    index === 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 
                                                    index === 1 ? 'bg-slate-100 text-slate-500 dark:bg-slate-800' : 
                                                    index === 2 ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20' : 
                                                    'bg-slate-50 text-slate-400 dark:bg-slate-900'
                                                }`}>
                                                    #{index + 1}
                                                </div>
                                                
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                                        {app.applicant?.name || 'Candidate Name'}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {app.applicant?.email || 'email@hidden.com'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6">
                                                {/* The AI Score */}
                                                <div className="text-center">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                                                        <Sparkles className="w-3 h-3 text-indigo-500"/> ATS Match
                                                    </p>
                                                    <p className={`text-3xl font-black ${
                                                        app.atsScore >= 85 ? 'text-green-500' : 
                                                        app.atsScore >= 70 ? 'text-amber-500' : 'text-red-500'
                                                    }`}>
                                                        {app.atsScore}<span className="text-lg text-slate-300 dark:text-slate-600">/100</span>
                                                    </p>
                                                </div>

                                                {/* Resume Action */}
                                                <a 
                                                    href={app.resumeUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                                    title="View Resume"
                                                >
                                                    <FileText className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}