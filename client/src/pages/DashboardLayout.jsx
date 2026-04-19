'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import EmergencyButton from '@/components/EmergencyButton';
import ProfileContextMenu from '@/components/ProfileContextMenu';

export default function DashboardLayout() {
    const { session, loading } = useAuth();
    const navigate = useNavigate();
    const status = loading ? 'loading' : session ? 'authenticated' : 'unauthenticated';
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-surface-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-3 border-medical-teal/30 border-t-medical-teal rounded-full animate-spin" />
                    <p className="text-surface-300 text-sm">Loading your vault…</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        navigate('/auth/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-surface-950 flex">
            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-40 glass-strong px-6 py-4 flex items-center justify-between">
                    {/* Mobile menu */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 text-surface-300 hover:text-white rounded-xl hover:bg-surface-800 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Emergency Button — top center */}
                    <div className="flex-1 flex justify-center">
                        <EmergencyButton />
                    </div>

                    {/* User Avatar / Profile Menu */}
                    <div className="flex items-center gap-3">
                        <ProfileContextMenu />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6"><Outlet /></main>
            </div>
        </div>
    );
}
