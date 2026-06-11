import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function MainLayout() {
    return (
        <div className="w-full min-h-screen flex flex-col font-sans selection:bg-blue-500/30">
            {/* Changed position to top-center 
                Added marginTop to prevent the toast from hiding behind the fixed Navbar 
            */}
            <Toaster 
                position="top-center" 
                toastOptions={{
                    className: 'dark:bg-[#111827] dark:text-white dark:border dark:border-[#1F2937]',
                    style: {
                        marginTop: '80px',
                    }
                }} 
            />
            
            <Navbar />
            
            {/* Edge-to-Edge Main Content Area with ZERO padding/margin */}
            <main className="flex-grow w-full m-0 p-0">
                <Outlet />
            </main>
        </div>
    );
}