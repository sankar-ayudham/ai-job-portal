import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Briefcase, Users, TrendingUp, ExternalLink, 
    Loader2, AlertCircle, FileText, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function RecruiterDashboard() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [isAppsLoading, setIsAppsLoading] = useState(false);

    useEffect(() => {
        // Ensure only recruiters can access this
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role !== 'Recruiter') {
            navigate('/');
            return;
        }

        fetchMyJobs();
    }, [navigate]);

    const fetchMyJobs = async () => {
        try {
            // Fetch jobs created by the logged-in recruiter
            // Make sure your backend job route handles getting a specific user's jobs
            const res = await api.get('/jobs/me'); 
            setJobs(res.data.data);
            
            // Automatically select the first job to load its applicants
            if (res.data.data.length > 0) {
                handleSelectJob(res.data.data[0]);
            }
        } catch (err) {
            toast.error('Failed to load your job postings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectJob = async (job) => {
        setSelectedJob(job);
        setIsAppsLoading(true);
        try {
            // Fetch applications for this specific job
            const res = await api.get(`/applications/job/${job._id}`);
            setApplications(res.data.data);
        } catch (err) {
            toast.error('Failed to load applications for this job');
        } finally {
            setIsAppsLoading(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4 text-slate-500 dark:bg-[#0B1120]">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="font-bold dark:text-slate-400">Loading your dashboard...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] pt-28 pb-20 transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                            Recruiter Dashboard
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400">
                            Manage your active job listings and review top candidates.
                        </p>
                    </div>
                    <Link 
                        to="/create-job" 
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
                    >
                        <Briefcase className="w-5 h-5" /> Post New Role
                    </Link>
                </div>

                {jobs.length === 0 ? (
                    /* Empty State */
                    <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800/60 p-12 text-center">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Briefcase className="w-10 h-10 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No active jobs yet</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                            You haven't posted any open positions. Create your first job listing to start receiving AI-analyzed applications.
                        </p>
                        <Link to="/create-job" className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-all hover:scale-105">
                            Post a Job Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        
                        {/* LEFT COLUMN: Job Listings Sidebar */}
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                <Briefcase className="w-5 h-5 text-blue-500" /> Your Active Jobs
                            </h3>
                            
                            <div className="space-y-3">
                                {jobs.map((job) => (
                                    <button
                                        key={job._id}
                                        onClick={() => handleSelectJob(job)}
                                        className={`w-full text-left p-5 rounded-2xl border transition-all ${
                                            selectedJob?._id === job._id 
                                                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/50' 
                                                : 'bg-white border-slate-200 hover:border-blue-300 dark:bg-[#0f172a] dark:border-slate-800/60 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        <h4 className={`font-bold text-lg mb-1 line-clamp-1 ${selectedJob?._id === job._id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                                            {job.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Applicants</span>
                                            <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Active</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Candidate Pipeline */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800/60 p-6 sm:p-8 shadow-sm h-full min-h-[500px]">
                                {selectedJob && (
                                    <div className="mb-8 pb-6 border-b border-slate-100 dark:border-slate-800/60 flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                                                {selectedJob.title} Pipeline
                                            </h2>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                <Users className="w-4 h-4" /> {applications.length} Total Candidates
                                            </p>
                                        </div>
                                        <Link to={`/jobs/${selectedJob._id}`} className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                            View Public Listing <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}

                                {isAppsLoading ? (
                                    <div className="py-20 flex justify-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                                    </div>
                                ) : applications.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AlertCircle className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No applications yet</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Candidates will appear here once they apply.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b-2 border-slate-100 dark:border-slate-800/60">
                                                    <th className="pb-4 text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase">Candidate</th>
                                                    <th className="pb-4 text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase text-center">ATS Score</th>
                                                    <th className="pb-4 text-xs font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase text-right">Resume</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                                {applications.map((app) => (
                                                    <tr key={app._id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                                        <td className="py-5 pr-4">
                                                            <div className="font-bold text-slate-900 dark:text-white mb-0.5">
                                                                {app.applicant?.name || 'Anonymous User'}
                                                            </div>
                                                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                                {app.applicant?.email || 'No email provided'}
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-4 text-center">
                                                            {app.atsAnalysis ? (
                                                                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-black text-sm border border-emerald-200 dark:border-emerald-800/50">
                                                                    {app.atsAnalysis.atsScore} Match
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Pending AI</span>
                                                            )}
                                                        </td>
                                                        <td className="py-5 pl-4 text-right">
                                                            <a 
                                                                href={app.resumeUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                                            >
                                                                <FileText className="w-4 h-4" /> View PDF
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}