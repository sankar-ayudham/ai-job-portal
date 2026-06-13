import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, Star, Loader2, ExternalLink } from 'lucide-react';
import api from '../api/axios';

export default function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Safely parse the user
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    // THE FIX: Safely grab the ID whether the backend uses `_id` or `id`
    const userId = user?._id || user?.id;

    useEffect(() => {
        const fetchMyApplications = async () => {
            // If there is no user ID, stop loading immediately
            if (!userId) {
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            try {
                // Fetch applications
                const res = await api.get('/applications');
                
                // BULLETPROOF FILTER: Compare stringified IDs
                const myApps = res.data.data.filter(app => {
                    const applicantId = app.applicant?._id || app.applicant;
                    return String(applicantId) === String(userId);
                });
                
                // Sort by newest first
                setApplications(myApps.reverse());
            } catch (error) {
                console.error('Failed to fetch applications', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyApplications();
    }, [userId]); // Depend on the safe string ID

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#030712] flex flex-col items-center justify-center pt-20 transition-colors">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500 font-medium">Loading your applications...</p>
            </div>
        );
    }

    // Calculate Real Metrics
    const totalApplied = applications.length;
    const reviewedApps = applications.filter(app => app.status === 'Reviewed' || app.atsScore > 0);
    const avgAtsScore = reviewedApps.length > 0 
        ? Math.round(reviewedApps.reduce((acc, curr) => acc + curr.atsScore, 0) / reviewedApps.length) 
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-28 pb-20 transition-colors">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                        Welcome back, {user?.name}
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        Here is an overview of your real job search progress.
                    </p>
                </div>

                {/* Real Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-6 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Briefcase className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Total Applied</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{totalApplied}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-6 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <CheckCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Reviewed by AI</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{reviewedApps.length}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-6 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Star className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Avg ATS Score</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{avgAtsScore}%</h3>
                        </div>
                    </div>
                </div>

                {/* Real Applications List */}
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Recent Applications</h2>
                
                {applications.length === 0 ? (
                    <div className="bg-white dark:bg-[#0f172a] p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                        <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Applications Yet</h3>
                        <p className="text-slate-500 mb-6">You haven't applied to any jobs yet. Start browsing!</p>
                        <Link to="/jobs" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications.map(app => (
                            <div key={app._id} className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">
                                            {app.job?.title || "Job Unavailable"}
                                        </h3>
                                        <p className="text-sm text-slate-500">{app.job?.companyNameFallback || "Unknown Company"}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-black ${
                                        app.atsScore >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        app.atsScore >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                    }`}>
                                        {app.atsScore ? `${app.atsScore}%` : 'Pending'}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" /> Applied
                                    </span>
                                    {app.job?._id && (
                                        <Link to={`/jobs/${app.job._id}`} className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center gap-1">
                                            View Job <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}