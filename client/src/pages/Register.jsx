import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Candidate' 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api.post('/auth/register', formData);
            
            // Save the user data to localStorage
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            // 🚀 THE FIX: Save the token!
            if (res.data.token) {
                localStorage.setItem('token', res.data.token); 
            }
            
            toast.success('Account created successfully!');
            
            if (res.data.user.role === 'Recruiter') {
                navigate('/recruiter-dashboard');
            } else {
                navigate('/dashboard');
            }
            
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] flex items-center justify-center p-6 pt-32 pb-12 transition-colors">
            <div className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create an Account</h1>
                    <p className="text-slate-500 dark:text-slate-400">Join the AI Job Portal today.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, role: 'Candidate'})}
                            className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${
                                formData.role === 'Candidate' 
                                ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                                : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400'
                            }`}
                        >
                            <User className="w-4 h-4" /> Candidate
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, role: 'Recruiter'})}
                            className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${
                                formData.role === 'Recruiter' 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' 
                                : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400'
                            }`}
                        >
                            <Briefcase className="w-4 h-4" /> Recruiter
                        </button>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                    </div>

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
                                minLength="6"
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
                        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</> : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-slate-500 dark:text-slate-400 mt-6 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}