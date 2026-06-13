import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, FileText, Loader2, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios'; 

export default function CreateJob() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    // 🚀 THE FIX: Split salary into Min and Max to match the database
    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        location: '',
        employmentType: 'Full-time',
        salaryMin: '',
        salaryMax: '',
        description: '',
        requirements: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 🚀 THE FIX: Package the payload EXACTLY how the backend expects it
            const payload = {
                title: formData.title,
                companyNameFallback: formData.companyName, // Fixes "Unknown Company"
                location: formData.location,
                employmentType: formData.employmentType,
                description: formData.description,
                requirements: formData.requirements.split(',').map(req => req.trim()),
                salary: {
                    min: Number(formData.salaryMin), // Converts string to strict Number
                    max: Number(formData.salaryMax)
                }
            };

            await api.post('/jobs', payload);
            
            toast.success('Job posted successfully!');
            navigate('/recruiter-dashboard');
            
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Failed to post job. Please ensure you are logged in.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-28 pb-20 transition-colors">
            <div className="max-w-3xl mx-auto px-6">
                
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                        Post a New Role
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        Create a listing to find your next great hire.
                    </p>
                </div>

                <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Title & Company */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Job Title</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="e.g. Senior React Developer"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                                <div className="relative">
                                    <Building className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="e.g. TechCorp Inc."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location, Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="e.g. Hyderabad, Telangana"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Employment Type</label>
                                <select
                                    value={formData.employmentType}
                                    onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                        </div>

                        {/* 🚀 THE FIX: Split Salary Inputs (Min and Max numbers) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Minimum Salary (₹)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.salaryMin}
                                        onChange={(e) => setFormData({...formData, salaryMin: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="e.g. 975000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Maximum Salary (₹)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.salaryMax}
                                        onChange={(e) => setFormData({...formData, salaryMax: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="e.g. 2275000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Job Description</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                <textarea
                                    required
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                                    placeholder="Describe the role and responsibilities..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Requirements */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Requirements (comma separated)</label>
                            <input
                                type="text"
                                required
                                value={formData.requirements}
                                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="e.g. Python, SQL, AWS, 3+ years experience"
                            />
                        </div>

                        {/* Submit */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Publishing Job...</> : 'Publish Job Listing'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}