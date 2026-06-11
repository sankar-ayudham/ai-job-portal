import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            return toast.error('Please fill in all fields');
        }

        setIsLoading(true);
        try {
            const res = await api.post('/auth/login', formData);
            
            // CRITICAL FIX: Save user data to localStorage so the Navbar detects the login session
            const userData = res.data.user || res.data.data; 
            localStorage.setItem('user', JSON.stringify(userData));

            toast.success('Welcome back!');
            
            // Route based on role (Recruiters go to Dashboard, Candidates go to Jobs)
            if (userData.role === 'Recruiter') {
                navigate('/dashboard');
            } else {
                navigate('/jobs');
            }
            
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Invalid credentials. Please try again.';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-6 bg-gradient-to-br from-[#e6fcf5] via-[#f3e8ff] to-[#e0f2fe] dark:from-gray-900 dark:via-[#17153B] dark:to-[#0F172A] transition-colors duration-500">
            
            <div className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden">
                
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-6 hover:scale-105 transition-transform shadow-lg shadow-blue-600/20">
                        <Sparkles className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Welcome back</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Log in to your AI Job Portal account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}