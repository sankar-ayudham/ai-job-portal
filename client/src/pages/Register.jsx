import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { User, Mail, Lock, Briefcase, UserCircle, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { setCredentials } from '../store/slices/authSlice';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Candidate'
    });
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/auth/register', formData);
            dispatch(setCredentials(response.data.data));
            toast.success('Registration successful!');
            
            if (response.data.data.role === 'Recruiter') {
                navigate('/dashboard');
            } else {
                navigate('/jobs');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Added pt-32 pb-16 and min-h-screen to ensure it clears the Navbar perfectly
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#030712] pt-32 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-[#0f172a] rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative z-10">
                <div className="px-8 pt-8 pb-6 text-center border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Create Account</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Join the next-generation AI hiring platform.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'Candidate' ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            <input type="radio" name="role" value="Candidate" checked={formData.role === 'Candidate'} onChange={handleChange} className="sr-only" />
                            <UserCircle className={`w-6 h-6 mb-2 ${formData.role === 'Candidate' ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                            <span className={`text-sm font-bold ${formData.role === 'Candidate' ? 'text-blue-700 dark:text-cyan-300' : 'text-slate-600 dark:text-slate-400'}`}>Candidate</span>
                        </label>
                        
                        <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'Recruiter' ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                            <input type="radio" name="role" value="Recruiter" checked={formData.role === 'Recruiter'} onChange={handleChange} className="sr-only" />
                            <Briefcase className={`w-6 h-6 mb-2 ${formData.role === 'Recruiter' ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                            <span className={`text-sm font-bold ${formData.role === 'Recruiter' ? 'text-blue-700 dark:text-cyan-300' : 'text-slate-600 dark:text-slate-400'}`}>Recruiter</span>
                        </label>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-cyan-500 focus:bg-white dark:focus:bg-[#0f172a] transition-all" />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email Address" className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-cyan-500 focus:bg-white dark:focus:bg-[#0f172a] transition-all" />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} placeholder="Password (min. 6 characters)" className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-cyan-500 focus:bg-white dark:focus:bg-[#0f172a] transition-all" />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md">
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="px-8 py-6 bg-slate-50 dark:bg-[#1e293b] border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-blue-600 dark:text-cyan-400 hover:underline">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}