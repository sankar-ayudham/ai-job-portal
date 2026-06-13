import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api.post('/auth/login', formData);
            
            // Save the user data to localStorage
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            // 🚀 THE FIX: Save the token so Axios can use it!
            if (res.data.token) {
                localStorage.setItem('token', res.data.token); 
            }
            
            toast.success('Logged in successfully!');
            
            if (res.data.user.role === 'Recruiter') {
                navigate('/recruiter-dashboard');
            } else {
                navigate('/dashboard');
            }
            
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] flex items-center justify-center p-6 pt-32 pb-12 transition-colors">
            <div className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400">Log in to your AI Job Portal account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Logging In...</> : 'Log In'}
                    </button>
                </form>

                <p className="text-center text-slate-500 dark:text-slate-400 mt-6 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}