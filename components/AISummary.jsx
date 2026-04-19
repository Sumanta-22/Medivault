'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, TrendingUp, Activity, Pill, Loader2 } from 'lucide-react';

// Mock AI summaries for demo
const MOCK_SUMMARIES = [
    {
        summary: 'Complete Blood Count (CBC) results are within normal ranges. Hemoglobin level is slightly elevated at 16.2 g/dL. White blood cell count is normal.',
        highlights: [
            { label: 'Hemoglobin', value: '16.2 g/dL', status: 'normal' },
            { label: 'WBC Count', value: '7,500/μL', status: 'normal' },
            { label: 'Platelet Count', value: '250,000/μL', status: 'normal' },
            { label: 'RBC Count', value: '5.1 M/μL', status: 'normal' },
        ],
    },
    {
        summary: 'Blood glucose levels indicate pre-diabetic range. Fasting glucose is 118 mg/dL. HbA1c is 6.1%. Recommend dietary modifications and follow-up in 3 months.',
        highlights: [
            { label: 'Fasting Glucose', value: '118 mg/dL', status: 'warning' },
            { label: 'HbA1c', value: '6.1%', status: 'warning' },
            { label: 'Cholesterol', value: '195 mg/dL', status: 'normal' },
            { label: 'Triglycerides', value: '160 mg/dL', status: 'normal' },
        ],
    },
    {
        summary: 'Chest X-ray shows clear lung fields bilaterally. No evidence of consolidation, effusion, or pneumothorax. Heart size is within normal limits.',
        highlights: [
            { label: 'Lungs', value: 'Clear', status: 'normal' },
            { label: 'Heart Size', value: 'Normal', status: 'normal' },
            { label: 'Bones', value: 'Intact', status: 'normal' },
        ],
    },
];

export default function AISummary({ document }) {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState('');

    const generateSummary = async () => {
        setLoading(true);
        setError('');

        try {
            // Try the API first
            const res = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documentId: document._id, name: document.name }),
            });

            const data = await res.json();

            if (data.summary) {
                setSummary(data);
            }
        } catch (err) {
            // Fallback to mock
            const randomSummary = MOCK_SUMMARIES[Math.floor(Math.random() * MOCK_SUMMARIES.length)];
            setSummary(randomSummary);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'normal': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-surface-300 bg-surface-800 border-surface-700';
        }
    };

    if (!summary && !loading) {
        return (
            <div className="glass-light rounded-2xl p-6 text-center">
                <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <h4 className="font-medium mb-2">AI-Powered Analysis</h4>
                <p className="text-sm text-surface-300 mb-4">
                    Get an instant, easy-to-understand summary of this medical report
                </p>
                <button
                    onClick={generateSummary}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                    Generate Summary
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="glass-light rounded-2xl p-8 text-center">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
                <p className="text-sm text-surface-300">Analyzing your report…</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary Text - Instagram comments style */}
            <div className="glass-light rounded-2xl p-5">
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">MediVault AI</span>
                            <span className="text-xs text-surface-300">Just now</span>
                        </div>
                        <p className="text-sm text-surface-200 leading-relaxed">{summary.summary}</p>
                    </div>
                </div>
            </div>

            {/* Highlights */}
            {summary.highlights && summary.highlights.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {summary.highlights.map((highlight, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-3 rounded-xl border ${getStatusColor(highlight.status)}`}
                        >
                            <p className="text-xs opacity-70 mb-1">{highlight.label}</p>
                            <p className="font-semibold text-sm">{highlight.value}</p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
