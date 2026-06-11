import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LogOut, User as UserIcon, Menu, X, Sun, Moon } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout').catch(() => {}); 
        } finally {
            localStorage.removeItem('user');
            setUser(null);
            toast.success('Logged out successfully');
            navigate('/');
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#030712]/80 backdrop-blur-md border-b border-slate-800 transition-all">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-20">
                    
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">AI Job Portal</span>
                    </Link>

                    {/* Desktop Center Links (Added Resume Builder here!) */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Home</Link>
                        <Link to="/jobs" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Browse Jobs</Link>
                        
                        {/* NEW LINK */}
                        <Link to="/resume-builder" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Resume Builder</Link>
                        
                        {user && (
                            <Link to={user.role === 'Recruiter' ? '/recruiter-dashboard' : '/dashboard'} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                                My Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Desktop Right Section (Auth + Theme Toggle) */}
                    <div className="hidden md:flex items-center gap-6">
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-full transition-all"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                                    <UserIcon className="w-4 h-4 text-blue-500" />
                                    {user.name || 'User'}
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
                                <Link to="/login" className="text-sm font-bold text-white hover:text-blue-400 transition-colors px-4 py-2">
                                    Login
                                </Link>
                                <Link to="/register" className="text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2.5 rounded-xl transition-all">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-4 md:hidden">
                        <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-amber-400">
                            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        </button>
                        <button className="p-2 text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#0f172a] border-b border-slate-800 px-6 py-4 space-y-4 shadow-2xl">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-sm font-bold text-slate-300 hover:text-white">Home</Link>
                    <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="block text-sm font-bold text-slate-300 hover:text-white">Browse Jobs</Link>
                    
                    {/* NEW LINK FOR MOBILE */}
                    <Link to="/resume-builder" onClick={() => setIsMenuOpen(false)} className="block text-sm font-bold text-slate-300 hover:text-white">Resume Builder</Link>
                    
                    {user ? (
                        <>
                            <Link to={user.role === 'Recruiter' ? '/recruiter-dashboard' : '/dashboard'} onClick={() => setIsMenuOpen(false)} className="block text-sm font-bold text-slate-300 hover:text-white">My Dashboard</Link>
                            <button onClick={handleLogout} className="block w-full text-left text-sm font-bold text-red-400 pt-2 border-t border-slate-800">Logout</button>
                        </>
                    ) : (
                        <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center text-sm font-bold text-white bg-slate-800 py-3 rounded-xl">Login</Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full text-center text-sm font-bold text-white bg-blue-600 py-3 rounded-xl">Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}