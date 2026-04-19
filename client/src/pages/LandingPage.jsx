'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Shield,
    Heart,
    FileText,
    Ambulance,
    Scan,
    Brain,
    ArrowRight,
    ChevronRight,
    Lock,
    Smartphone,
    Users,
    Clock,
} from 'lucide-react';

const features = [
    {
        icon: Shield,
        title: 'Bank-Grade Security',
        description: 'Your medical data is encrypted and stored with enterprise-level security protocols.',
        color: 'from-teal-500 to-cyan-500',
    },
    {
        icon: FileText,
        title: 'Smart Organization',
        description: 'Create folders for Blood Tests, Prescriptions, X-Rays, MRI — everything in one place.',
        color: 'from-blue-500 to-indigo-500',
    },
    {
        icon: Ambulance,
        title: 'Emergency SOS',
        description: 'One-tap emergency access — locate hospitals, call ambulances, share your medical ID.',
        color: 'from-red-500 to-rose-500',
    },
    {
        icon: Scan,
        title: 'Scan & Upload',
        description: 'Scan documents with your camera or upload files. Everything gets organized automatically.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Brain,
        title: 'AI Report Summaries',
        description: 'Get instant, easy-to-understand summaries of complex medical reports powered by AI.',
        color: 'from-amber-500 to-orange-500',
    },
    {
        icon: Users,
        title: 'Family Accounts',
        description: 'Manage medical records for your entire family under one secure account.',
        color: 'from-green-500 to-emerald-500',
    },
];

const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Records Stored', value: '2M+' },
    { label: 'Uptime', value: '99.9%' },
    { label: 'Countries', value: '45+' },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-surface-950 overflow-hidden">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-medical-teal/5 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[128px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-medical-blue/3 rounded-full blur-[160px]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 glass-strong sticky top-0">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-teal flex items-center justify-center shadow-glow-teal">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            Medi<span className="text-medical-teal">Vault</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-surface-300 hover:text-white transition-colors">
                            Features
                        </a>
                        <a href="#security" className="text-sm text-surface-300 hover:text-white transition-colors">
                            Security
                        </a>
                        <a href="#about" className="text-sm text-surface-300 hover:text-white transition-colors">
                            About
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/auth/login"
                            className="px-5 py-2.5 text-sm font-medium text-surface-300 hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/auth/register"
                            className="px-5 py-2.5 text-sm font-medium bg-gradient-teal text-white rounded-xl hover:opacity-90 transition-opacity shadow-glow-teal"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-xs font-medium text-medical-teal-light mb-8">
                        <Lock className="w-3.5 h-3.5" />
                        <span>HIPAA Compliant · End-to-End Encrypted</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                        Your Medical Records,{' '}
                        <span className="text-gradient">Secured Forever</span>
                    </h1>

                    <p className="text-lg md:text-xl text-surface-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Store, organize, and access your complete medical history from anywhere.
                        With emergency SOS, AI-powered insights, and bank-grade security.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/auth/register"
                            className="group px-8 py-4 bg-gradient-teal text-white rounded-2xl font-semibold text-lg shadow-glow-teal hover:shadow-[0_0_40px_rgba(13,148,136,0.4)] transition-all duration-300 flex items-center gap-2"
                        >
                            Start Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#features"
                            className="px-8 py-4 glass text-white rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                        >
                            See Features
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-20 glass rounded-2xl p-8 max-w-3xl mx-auto"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                                <div className="text-sm text-surface-300 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Everything You Need for{' '}
                        <span className="text-gradient">Digital Health</span>
                    </h2>
                    <p className="text-surface-300 text-lg max-w-2xl mx-auto">
                        From scan to summary, from storage to emergency — MediVault handles it all.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group glass rounded-2xl p-8 hover:bg-white/[0.06] transition-all duration-300 cursor-default"
                        >
                            <div
                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                            >
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-surface-300 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Security Section */}
            <section id="security" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                <div className="glass rounded-3xl p-12 md:p-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-20 h-20 rounded-3xl bg-gradient-teal flex items-center justify-center mx-auto mb-8 shadow-glow-teal">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Your Privacy is Our <span className="text-gradient">Priority</span>
                        </h2>
                        <p className="text-surface-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                            All medical data is encrypted at rest and in transit. We use industry-standard
                            security practices so your health records stay private — always.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            {[
                                { icon: Lock, label: 'AES-256 Encryption' },
                                { icon: Smartphone, label: 'Two-Factor Auth' },
                                { icon: Clock, label: 'Audit Logging' },
                            ].map((item) => (
                                <div key={item.label} className="glass-light rounded-xl p-6">
                                    <item.icon className="w-8 h-8 text-medical-teal mx-auto mb-3" />
                                    <div className="text-sm font-medium">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Ready to Secure Your{' '}
                        <span className="text-gradient">Health Records</span>?
                    </h2>
                    <p className="text-surface-300 text-lg max-w-xl mx-auto mb-10">
                        Join thousands of families who trust MediVault with their medical history.
                    </p>
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-teal text-white rounded-2xl font-bold text-lg shadow-glow-teal hover:shadow-[0_0_50px_rgba(13,148,136,0.4)] transition-all duration-300"
                    >
                        Create Free Account
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-surface-800 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-medical-teal" />
                        <span className="font-semibold">MediVault</span>
                    </div>
                    <p className="text-sm text-surface-300">
                        © {new Date().getFullYear()} MediVault. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
