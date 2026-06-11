import React, { useState } from 'react';
import { Wand2, FileText, CheckCircle2, Download, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function ResumeBuilder() {
    const [formData, setFormData] = useState({
        role: '',
        rawText: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [optimizedBullets, setOptimizedBullets] = useState([]);

    const handleOptimize = async () => {
        if (!formData.rawText) return toast.error('Please enter some experience to optimize!');
        
        setIsGenerating(true);
        try {
            const res = await api.post('/ai/optimize', formData);
            setOptimizedBullets(res.data.data);
            toast.success('Experience optimized for ATS!');
        } catch (err) {
            toast.error('Failed to generate optimized text.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] pt-28 pb-20 transition-colors">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                
                <div className="mb-10 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-6 shadow-lg shadow-indigo-600/20">
                        <Wand2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        AI Resume Builder
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        Stop worrying about formatting. Dump your messy project notes below, and our AI will instantly rewrite them into high-converting ATS bullet points.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 h-[600px]">
                    
                    {/* LEFT PANE: The Input Workspace */}
                    <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" /> Your Experience
                        </h2>

                        <div className="space-y-6 flex-1 flex flex-col relative z-10">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Target Job Title</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    placeholder="e.g., Full Stack Developer"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>

                            <div className="flex-1 flex flex-col">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Raw Notes & Responsibilities</label>
                                <textarea
                                    value={formData.rawText}
                                    onChange={(e) => setFormData({...formData, rawText: e.target.value})}
                                    placeholder="e.g., Developed a full-stack application using the MERN stack. Built a machine learning pipeline for face recognition using Python, Flask, and OpenCV. Solved algorithmic problems to optimize backend routes..."
                                    className="w-full flex-1 px-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                                />
                            </div>

                            <button
                                onClick={handleOptimize}
                                disabled={isGenerating || !formData.rawText}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Rewriting for ATS...</>
                                ) : (
                                    <><Sparkles className="w-5 h-5" /> Generate ATS Bullets</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT PANE: The Output Display */}
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8 flex flex-col h-full relative overflow-hidden text-slate-300">
                        
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" /> Optimized Output
                            </h2>
                            <button 
                                onClick={() => window.print()} 
                                disabled={optimizedBullets.length === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                            >
                                <Download className="w-4 h-4" /> Export
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2">
                            {optimizedBullets.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                                    <Sparkles className="w-12 h-12 opacity-20" />
                                    <p className="text-center max-w-sm">
                                        Your AI-optimized bullets will appear here. They are designed to pass ATS filters and impress human recruiters.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="mb-2">
                                        <h3 className="text-white font-bold text-lg">{formData.role || 'Software Engineer'}</h3>
                                        <p className="text-slate-500 text-sm">Professional Experience</p>
                                    </div>
                                    <ul className="space-y-4 list-disc pl-5">
                                        {optimizedBullets.map((bullet, idx) => (
                                            <li key={idx} className="text-slate-300 leading-relaxed text-[15px] pl-2 marker:text-indigo-500">
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}