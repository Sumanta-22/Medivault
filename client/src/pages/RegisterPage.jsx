'use client';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    Users,
    UserCircle,
    Plus,
    X,
    Check,
} from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: 'individual',
        familyMembers: [],
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', relation: '', age: '' });

    const addFamilyMember = () => {
        if (!newMember.name || !newMember.relation) return;
        setForm({
            ...form,
            familyMembers: [
                ...form.familyMembers,
                { ...newMember, age: parseInt(newMember.age) || 0 },
            ],
        });
        setNewMember({ name: '', relation: '', age: '' });
    };

    const removeFamilyMember = (index) => {
        setForm({
            ...form,
            familyMembers: form.familyMembers.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (step === 1) {
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (form.password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
            setStep(2);
            return;
        }

        if (step === 2 && form.accountType === 'family') {
            setStep(3);
            return;
        }

        // Final submission
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    accountType: form.accountType,
                    familyMembers: form.familyMembers,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            navigate('/auth/login?registered=true');
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-medical-teal/8 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-primary-600/8 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-lg"
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
                    <p className="text-surface-300 text-sm">Create your secure medical vault</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= s
                                        ? 'bg-gradient-teal text-white shadow-glow-teal'
                                        : 'bg-surface-800 text-surface-300'
                                    }`}
                            >
                                {step > s ? <Check className="w-4 h-4" /> : s}
                            </div>
                            {s < 3 && (
                                <div className={`w-12 h-0.5 ${step > s ? 'bg-medical-teal' : 'bg-surface-700'} transition-all`} />
                            )}
                        </div>
                    ))}
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

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {/* Step 1: Credentials */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <h2 className="text-xl font-semibold mb-2">Your Details</h2>

                                    <div>
                                        <label className="block text-sm font-medium text-surface-300 mb-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white placeholder-surface-300 transition-all"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-surface-300 mb-2">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white placeholder-surface-300 transition-all"
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
                                                className="w-full pl-12 pr-12 py-3.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white placeholder-surface-300 transition-all"
                                                placeholder="Min. 6 characters"
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

                                    <div>
                                        <label className="block text-sm font-medium text-surface-300 mb-2">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                                            <input
                                                type="password"
                                                value={form.confirmPassword}
                                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white placeholder-surface-300 transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-gradient-teal text-white rounded-xl font-semibold shadow-glow-teal hover:shadow-[0_0_30px_rgba(13,148,136,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        Continue
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 2: Account Type */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <h2 className="text-xl font-semibold mb-2">Choose Account Type</h2>
                                    <p className="text-surface-300 text-sm mb-6">
                                        Select how you want to manage your medical records
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, accountType: 'individual' })}
                                            className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${form.accountType === 'individual'
                                                    ? 'border-medical-teal bg-medical-teal/10 shadow-glow-teal'
                                                    : 'border-surface-700 bg-surface-800/50 hover:border-surface-600'
                                                }`}
                                        >
                                            <UserCircle className={`w-10 h-10 mb-4 ${form.accountType === 'individual' ? 'text-medical-teal' : 'text-surface-300'}`} />
                                            <h3 className="font-semibold mb-1">Individual</h3>
                                            <p className="text-xs text-surface-300">Personal medical records</p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, accountType: 'family' })}
                                            className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${form.accountType === 'family'
                                                    ? 'border-medical-teal bg-medical-teal/10 shadow-glow-teal'
                                                    : 'border-surface-700 bg-surface-800/50 hover:border-surface-600'
                                                }`}
                                        >
                                            <Users className={`w-10 h-10 mb-4 ${form.accountType === 'family' ? 'text-medical-teal' : 'text-surface-300'}`} />
                                            <h3 className="font-semibold mb-1">Family</h3>
                                            <p className="text-xs text-surface-300">Multiple family members</p>
                                        </button>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 py-4 glass text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 py-4 bg-gradient-teal text-white rounded-xl font-semibold shadow-glow-teal hover:shadow-[0_0_30px_rgba(13,148,136,0.4)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : form.accountType === 'family' ? (
                                                <>
                                                    Add Members
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            ) : (
                                                <>
                                                    Create Account
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Family Members */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <h2 className="text-xl font-semibold mb-2">Add Family Members</h2>
                                    <p className="text-surface-300 text-sm mb-4">
                                        You can add or remove members later from settings
                                    </p>

                                    {/* Members list */}
                                    {form.familyMembers.length > 0 && (
                                        <div className="space-y-2">
                                            {form.familyMembers.map((member, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-3 bg-surface-800/50 rounded-xl"
                                                >
                                                    <div>
                                                        <span className="font-medium">{member.name}</span>
                                                        <span className="text-surface-300 text-sm ml-2">
                                                            ({member.relation}{member.age ? `, ${member.age}y` : ''})
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFamilyMember(idx)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add member form */}
                                    <div className="p-4 border border-dashed border-surface-700 rounded-xl space-y-3">
                                        <input
                                            type="text"
                                            value={newMember.name}
                                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-xl text-white placeholder-surface-300 transition-all"
                                            placeholder="Member name"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <select
                                                value={newMember.relation}
                                                onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                                                className="px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-xl text-white transition-all"
                                            >
                                                <option value="">Relation</option>
                                                <option value="spouse">Spouse</option>
                                                <option value="child">Child</option>
                                                <option value="parent">Parent</option>
                                                <option value="sibling">Sibling</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <input
                                                type="number"
                                                value={newMember.age}
                                                onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                                                className="px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-xl text-white placeholder-surface-300 transition-all"
                                                placeholder="Age"
                                                min="0"
                                                max="120"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addFamilyMember}
                                            className="w-full py-3 border border-medical-teal/50 text-medical-teal rounded-xl font-medium hover:bg-medical-teal/10 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Member
                                        </button>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="flex-1 py-4 glass text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 py-4 bg-gradient-teal text-white rounded-xl font-semibold shadow-glow-teal hover:shadow-[0_0_30px_rgba(13,148,136,0.4)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Create Account
                                                    <Check className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <p className="text-center text-sm text-surface-300 mt-6">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-medical-teal hover:text-medical-teal-light font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
