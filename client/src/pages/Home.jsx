import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, FileText, CheckCircle2, XCircle, ChevronDown, MapPin, Briefcase } from 'lucide-react';

export default function Home() {
    return (
        <div className="w-full overflow-hidden">
            
            {/* FULL VIEWPORT HERO WITH SOFT MESH GRADIENT */}
            <section className="relative w-full min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-[#e6fcf5] via-[#f3e8ff] to-[#e0f2fe] dark:from-gray-900 dark:via-[#17153B] dark:to-[#0F172A] transition-colors duration-500">
                
                <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10 py-12">
                    
                    {/* LEFT COLUMN: AI Job Portal Marketing Copy */}
                    <div className="max-w-xl">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                            className="text-xs font-black text-blue-600 dark:text-cyan-400 uppercase tracking-[0.2em] mb-4"
                        >
                            AI Job Portal & ATS Analyzer
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold text-slate-800 dark:text-white leading-[1.1] mb-6"
                        >
                            Find Jobs & Beat the ATS.
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-lg"
                        >
                            Browse hundreds of premium tech jobs. Our AI instantly compares your resume to the job description, giving you an exact ATS match score before you apply.
                        </motion.p>
                        
                        {/* Redesigned CTA Box */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white/60 dark:bg-black/20 backdrop-blur-md border border-slate-200/50 dark:border-white/10 rounded-2xl p-8 max-w-md shadow-lg shadow-blue-900/5 border-dashed"
                            style={{ borderDasharray: '6 6' }}
                        >
                            <div className="text-center">
                                <Briefcase className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                                <p className="text-slate-700 dark:text-slate-300 font-bold text-xl mb-1">Ready to get hired?</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Find a role and test your resume instantly.</p>
                                
                                {/* FIXED ROUTING: Now goes to /jobs instead of /register */}
                                <Link to="/jobs" className="inline-flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                    Explore Jobs & Match Resume
                                </Link>
                                
                                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    <Lock className="w-3.5 h-3.5" />
                                    AI-powered privacy & security
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Floating Dashboard UI */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="relative w-full max-w-[700px] mx-auto lg:ml-auto"
                    >
                        <div className="bg-white dark:bg-[#0f172a] rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-white dark:border-slate-800 overflow-hidden flex flex-col h-[550px]">
                            
                            <div className="bg-white dark:bg-[#0f172a] border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
                                    AI
                                </div>
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">AI Job Portal</span>
                            </div>

                            <div className="flex flex-1 overflow-hidden">
                                <div className="w-1/3 border-r border-slate-100 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-[#0b1120]/50 overflow-y-auto">
                                    <h3 className="font-bold text-slate-800 dark:text-white text-center mb-6">ATS Score</h3>
                                    
                                    <div className="relative w-32 h-16 mx-auto mb-8 overflow-hidden">
                                        <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-slate-200 dark:border-slate-700"></div>
                                        <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-green-500 border-b-transparent border-r-transparent transform -rotate-45"></div>
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                            <div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-white mb-1"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                                                <span>ANALYSIS</span>
                                                <ChevronDown className="w-3 h-3" />
                                            </div>
                                            <ul className="space-y-2.5">
                                                <li className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Skill Match
                                                </li>
                                                <li className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Experience Level
                                                </li>
                                                <li className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    <XCircle className="w-3.5 h-3.5 text-red-500" /> Missing Keywords
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-8 bg-white dark:bg-[#0f172a] overflow-y-auto">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                                            <FileText className="w-3 h-3 text-blue-600" />
                                        </div>
                                        <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">OPTIMIZED RESUME</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                            <div className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1 before:w-1 before:h-3 before:bg-blue-500 before:rounded-full">
                                                ATS PARSE RATE
                                            </div>
                                            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-2"></div>
                                            <div className="w-3/4 h-3 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                        </div>

                                        <div className="border-2 border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-5 relative">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1 flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-amber-500" />
                                                <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                                            </div>
                                            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-3"></div>
                                            <div className="w-5/6 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-3"></div>
                                            <div className="w-4/6 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}