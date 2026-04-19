'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });

            const data = await result.json();

            if (!result.ok) {
                setError(data.error || 'Login failed');
            } else {
                authLogin(data.token, data.user);
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-medical-teal/8 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-primary-600/8 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-teal flex items-center justify-center shadow-glow-teal">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            Medi<span className="text-medical-teal">Vault</span>
                        </span>
                    </Link>
                    <p className="text-surface-300 text-sm">Sign in to access your medical records</p>
                </div>

                {/* Form Card */}
                <div className="glass rounded-3xl p-8 shadow-glass-lg">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 text-sm text-red-400"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-surface-300 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white placeholder-surface-300 focus:border-medical-teal focus:ring-1 focus:ring-medical-teal/30 transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full pl-12 pr-12 py-3.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white placeholder-surface-300 focus:border-medical-teal focus:ring-1 focus:ring-medical-teal/30 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-teal text-white rounded-xl font-semibold text-base shadow-glow-teal hover:shadow-[0_0_30px_rgba(13,148,136,0.4)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-surface-300 mt-6">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register" className="text-medical-teal hover:text-medical-teal-light font-medium transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
