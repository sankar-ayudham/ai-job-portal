import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Dashboard from './pages/Dashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import ResumeBuilder from './pages/ResumeBuilder';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="jobs" element={<Jobs />} /> 
                <Route path="jobs/:id" element={<JobDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
                <Route path="/resume-builder" element={<ResumeBuilder />} />
                
                <Route path="*" element={
                    <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
                        <div>
                            <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4">404</h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Page Not Found</p>
                        </div>
                    </div>
                } />
            </Route>
        </Routes>
    );
}