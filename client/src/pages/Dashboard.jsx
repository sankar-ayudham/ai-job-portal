import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Briefcase, CheckCircle, Clock, XCircle, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const fetchMyData = async () => {
            try {
                // Fetch the user's specific applications
                const res = await api.get('/applications/me');
                setApplications(res.data.data);
            } catch (err) {
                toast.error('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyData();
    }, []);

    // Calculate Metrics
    const totalApps = applications.length;
    const pendingApps = applications.filter(app => app.status === 'Pending').length;
    const reviewedApps = applications.filter(app => app.status === 'Reviewed').length;
    
    // Calculate Average ATS Score
    const scoredApps = applications.filter(app => app.atsScore > 0);
    const avgScore = scoredApps.length > 0 
        ? Math.round(scoredApps.reduce((acc, curr) => acc + curr.atsScore, 0) / scoredApps.length)
        : 0;

    // Mock Chart Data based on user activity (In production, group backend data by date)
    const chartData = [
        { name: 'Week 1', apps: Math.floor(totalApps * 0.2) },
        { name: 'Week 2', apps: Math.floor(totalApps * 0.5) },
        { name: 'Week 3', apps: Math.floor(totalApps * 0.8) },
        { name: 'This Week', apps: totalApps },
    ];

    if (isLoading) return (
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-4 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="font-bold">Loading your dashboard...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-32 space-y-8">
            
            {/* Header Section */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                    Here is an overview of your job search progress.
                </p>
            </div>

            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <Briefcase className="w-7 h-7 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Total Applied</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{totalApps}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                        <Clock className="w-7 h-7 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Pending Review</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{pendingApps}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Viewed by HR</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{reviewedApps}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center z-10">
                        <Sparkles className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="z-10">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Avg ATS Score</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{avgScore}</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 pt-4">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="text-blue-500 w-5 h-5"/> Application Activity
                        </h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="apps" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Applications List */}
                <div className="bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Applications</h2>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {applications.length === 0 ? (
                            <p className="text-slate-500 dark:text-slate-400 text-center pt-10">No applications yet. Start applying!</p>
                        ) : (
                            applications.slice().reverse().map(app => (
                                <div key={app._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{app.job?.title || 'Job Title Unavailable'}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 truncate">{app.job?.location || 'Remote'}</p>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                            app.status === 'Reviewed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            app.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}>
                                            {app.status}
                                        </span>
                                        {app.atsScore > 0 && (
                                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                                <Sparkles className="w-3 h-3"/> {app.atsScore}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}