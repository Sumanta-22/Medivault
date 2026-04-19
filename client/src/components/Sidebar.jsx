
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    LayoutDashboard,
    FolderOpen,
    UserCircle,
    Settings,
    LogOut,
    X,
    Shield,
} from 'lucide-react';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/profile', icon: UserCircle, label: 'Emergency Profile' },
];

export default function Sidebar({ open, onClose }) {
    const { pathname } = useLocation();
    const { session, logout } = useAuth();

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-6 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-teal flex items-center justify-center shadow-glow-teal">
                        <Heart className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">
                        Medi<span className="text-medical-teal">Vault</span>
                    </span>
                </Link>
                <button
                    onClick={onClose}
                    className="lg:hidden p-1.5 text-surface-300 hover:text-white rounded-lg hover:bg-surface-800 transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-medical-teal/15 text-medical-teal shadow-medical'
                                    : 'text-surface-300 hover:text-white hover:bg-surface-800'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="px-4 py-6 border-t border-surface-800">
                <div className="flex items-center gap-3 px-4 py-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-teal flex items-center justify-center text-white font-semibold">
                        {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{session?.user?.name || 'User'}</p>
                        <p className="text-xs text-surface-300 truncate">{session?.user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={() => { logout(); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-surface-300 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-surface-900/80 backdrop-blur-xl border-r border-surface-800 z-50">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-surface-900 border-r border-surface-800 z-50 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
