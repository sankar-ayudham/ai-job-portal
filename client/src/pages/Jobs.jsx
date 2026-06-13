import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Briefcase, IndianRupee, Filter, Loader2, ChevronLeft, ChevronRight, Clock, Check } from 'lucide-react';
import api from '../api/axios';

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Search, Filter & Pagination State
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    
    // Multi-select filter state
    const [selectedTypes, setSelectedTypes] = useState([]);

    // Fetch jobs whenever page, keyword, or filters change
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                const delayDebounceFn = setTimeout(async () => {
                    // Dynamically build the URL based on active states
                    let url = `/jobs?page=${page}&limit=10`;
                    if (keyword) url += `&keyword=${keyword}`;
                    if (selectedTypes.length > 0) url += `&employmentType=${selectedTypes.join(',')}`;

                    const res = await api.get(url);
                    setJobs(res.data.data);
                    setTotalPages(res.data.pagination.totalPages);
                    setTotalJobs(res.data.pagination.totalJobs);
                    setIsLoading(false);
                }, 400);

                return () => clearTimeout(delayDebounceFn);
            } catch (err) {
                console.error('Failed to fetch jobs', err);
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, [page, keyword, selectedTypes]); // Re-run when filters change

    // Toggle filter selection
    const handleTypeToggle = (type) => {
        setSelectedTypes(prev => {
            if (prev.includes(type)) {
                return prev.filter(t => t !== type); // Remove if already selected
            } else {
                return [...prev, type]; // Add if not selected
            }
        });
        setPage(1); // Always reset to page 1 when changing filters
    };

    // Formatting helper for time
    const timeAgo = (dateString) => {
        const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        return `${days} days ago`;
    };

    // Formatting helper for Indian Rupee
    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-28 pb-20 transition-colors">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                
                {/* Header & Search Bar */}
                <div className="mb-10 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Find your next role
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">
                        Browse through {totalJobs} premium tech opportunities.
                    </p>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(1); 
                            }}
                            className="block w-full pl-12 pr-4 py-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-xl shadow-slate-200/20 dark:shadow-none transition-all outline-none text-lg font-medium"
                            placeholder="Search by job title, skill, or company..."
                        />
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    
                    {/* LEFT SIDEBAR: Interactive Filters */}
                    <div className="hidden lg:block space-y-6">
                        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 sticky top-28 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white font-black text-lg tracking-tight">
                                <Filter className="w-5 h-5 text-blue-500" /> Filters
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Job Type</label>
                                    <div className="space-y-4">
                                        {['Full-time', 'Contract', 'Remote', 'Freelance'].map(type => {
                                            const isSelected = selectedTypes.includes(type);
                                            return (
                                                <button 
                                                    key={type}
                                                    onClick={() => handleTypeToggle(type)}
                                                    className="flex items-center gap-3 w-full group text-left"
                                                >
                                                    <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                                                        isSelected 
                                                            ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-500/20' 
                                                            : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 group-hover:border-blue-500'
                                                    }`}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                    <span className={`text-sm font-medium transition-colors ${
                                                        isSelected 
                                                            ? 'text-slate-900 dark:text-white font-bold' 
                                                            : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                                                    }`}>
                                                        {type}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT: Job Feed */}
                    <div className="lg:col-span-3 space-y-4">
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-500">
                                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                                <p className="font-medium">Searching database...</p>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="bg-white dark:bg-[#0f172a] p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                                <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No jobs found</h3>
                                <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search keywords.</p>
                                {selectedTypes.length > 0 && (
                                    <button 
                                        onClick={() => setSelectedTypes([])}
                                        className="mt-6 px-6 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Job Cards */}
                                {jobs.map(job => (
                                    <Link 
                                        to={`/jobs/${job._id}`} 
                                        key={job._id}
                                        className="block bg-white dark:bg-[#0f172a] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-900/5 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
                                            <div className="space-y-3 flex-1">
                                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                                    {job.title}
                                                </h2>
                                                
                                                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-slate-800 dark:text-slate-200">
                                                        <Building2 className="w-4 h-4 text-blue-500" /> 
                                                        {job.company?.name || job.companyNameFallback || 'Unknown Company'}
                                                    </span>
                                                    
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-slate-800 dark:text-slate-200">
                                                        <MapPin className="w-4 h-4 text-rose-500" /> {job.location || 'Remote'}
                                                    </span>
                                                    
                                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-slate-800 dark:text-slate-200">
                                                        <Briefcase className="w-4 h-4 text-indigo-500" /> {job.employmentType || 'Full-time'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                                                {job.salary?.min > 0 && (
                                                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center">
                                                        <IndianRupee className="w-5 h-5 -mr-1" />
                                                        {formatSalary(job.salary.min)} - {formatSalary(job.salary.max)}
                                                    </span>
                                                )}
                                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                                                    <Clock className="w-3.5 h-3.5" /> {timeAgo(job.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800 mt-8">
                                        <button 
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-5 h-5" /> Previous
                                        </button>
                                        
                                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                            Page <span className="text-slate-900 dark:text-white">{page}</span> of {totalPages}
                                        </span>

                                        <button 
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}