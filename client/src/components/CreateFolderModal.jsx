
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderPlus } from 'lucide-react';

const FOLDER_ICONS = ['📁', '🩸', '💊', '🦴', '🧠', '💉', '🦷', '👁️', '🫀', '🫁', '📋'];
const FOLDER_COLORS = [
    '#0d9488', '#dc2626', '#0284c7', '#7c3aed', '#16a34a', '#f59e0b',
    '#ec4899', '#6366f1', '#14b8a6', '#f97316',
];

export default function CreateFolderModal({ open, onClose, onCreated, editFolder }) {
    const [name, setName] = useState(editFolder?.name || '');
    const [icon, setIcon] = useState(editFolder?.icon || '📁');
    const [color, setColor] = useState(editFolder?.color || '#0d9488');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onCreated({ name: name.trim(), icon, color });
        setName('');
        setIcon('📁');
        setColor('#0d9488');
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-x-4 top-[20%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50"
                    >
                        <div className="bg-surface-900 border border-surface-700 rounded-3xl shadow-glass-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <FolderPlus className="w-5 h-5 text-medical-teal" />
                                    {editFolder ? 'Rename Folder' : 'Create Folder'}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-surface-300 hover:text-white hover:bg-surface-800 rounded-xl transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-surface-300 mb-2">Folder Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white placeholder-surface-300 transition-all"
                                        placeholder="e.g., Blood Tests"
                                        autoFocus
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-surface-300 mb-2">Icon</label>
                                    <div className="flex flex-wrap gap-2">
                                        {FOLDER_ICONS.map((ic) => (
                                            <button
                                                key={ic}
                                                type="button"
                                                onClick={() => setIcon(ic)}
                                                className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${icon === ic
                                                        ? 'bg-medical-teal/20 border-2 border-medical-teal'
                                                        : 'bg-surface-800 border-2 border-transparent hover:border-surface-600'
                                                    }`}
                                            >
                                                {ic}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-surface-300 mb-2">Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {FOLDER_COLORS.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setColor(c)}
                                                className={`w-8 h-8 rounded-lg transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-900 scale-110' : ''
                                                    }`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-gradient-teal text-white rounded-xl font-semibold shadow-glow-teal hover:shadow-[0_0_30px_rgba(13,148,136,0.4)] transition-all duration-300"
                                >
                                    {editFolder ? 'Save Changes' : 'Create Folder'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
