import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle'; 

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation(); 

    // Safety net: Check local storage for the user
    let user = null;
    try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'undefined' && userStr !== 'null') {
            user = JSON.parse(userStr);
        }
    } catch (error) {
        console.error("Error parsing user data, clearing cache.");
        localStorage.removeItem('user');
    }

    const handleLogout = () => {
        localStorage.clear(); 
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 w-full bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800/60 z-50 transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        AI Job Portal
                    </span>
                </Link>

                {/* Center Links (Kept your dynamic routing, matched the image's styling) */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Home</Link>
                    <Link to="/jobs" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Browse Jobs</Link>
                    
                    {/* Dynamic Links Based on Role */}
                    {user?.role === 'Recruiter' && (
                        <>
                            <Link to="/create-job" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Post a Job</Link>
                            <Link to="/recruiter-dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Dashboard</Link>
                        </>
                    )}

                    {user?.role === 'Candidate' && (
                        <>
                            <Link to="/resume-builder" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Resume Builder</Link>
                            <Link to="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Dashboard</Link>
                        </>
                    )}
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center gap-5">
                    
                    {/* Minimalist Dark Mode Toggle */}
                    <ThemeToggle />

                    {/* Auth Buttons */}
                    {user ? (
                        <div className="flex items-center gap-5">
                            <span className="hidden md:block text-sm font-medium text-slate-900 dark:text-slate-300">
                                {user.name}
                            </span>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-5">
                            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                                Login
                            </Link>
                            {/* Sleek Translucent Sign Up Button */}
                            <Link to="/register" className="text-sm font-medium px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/20 text-white rounded-lg transition-all">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}