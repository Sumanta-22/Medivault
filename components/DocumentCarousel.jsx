'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, Image, Calendar, Sparkles, Trash2, X, Eye } from 'lucide-react';
import AISummary from './AISummary';

export default function DocumentCarousel({ documents, onDelete }) {
    const scrollRef = useRef(null);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [previewDoc, setPreviewDoc] = useState(null);

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = 320;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    if (!documents || documents.length === 0) {
        return (
            <div className="text-center py-16">
                <FileText className="w-16 h-16 text-surface-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-surface-300 mb-2">No documents yet</h3>
                <p className="text-sm text-surface-300">Use the + button to scan or upload documents</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Carousel */}
            <div className="relative">
                {/* Scroll Buttons */}
                {documents.length > 2 && (
                    <>
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-lg"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-lg"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 carousel-container scrollbar-hide px-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {documents.map((doc, index) => (
                        <motion.div
                            key={doc._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`carousel-item flex-shrink-0 w-72 glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${selectedDoc?._id === doc._id
                                ? 'ring-2 ring-medical-teal shadow-glow-teal'
                                : 'hover:shadow-glass'
                                }`}
                            onClick={() => setSelectedDoc(selectedDoc?._id === doc._id ? null : doc)}
                        >
                            {/* Preview */}
                            <div
                                className="aspect-[4/3] bg-surface-800 relative flex items-center justify-center overflow-hidden group"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewDoc(doc);
                                }}
                            >
                                {doc.data && doc.type?.startsWith('image') ? (
                                    <img src={doc.data} alt={doc.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-surface-300">
                                        <FileText className="w-12 h-12" />
                                        <span className="text-xs">PDF Document</span>
                                    </div>
                                )}

                                {/* Type Badge */}
                                <div className="absolute top-3 left-3 px-2.5 py-1 glass rounded-lg text-xs font-medium flex items-center gap-1">
                                    {doc.type?.startsWith('image') ? (
                                        <Image className="w-3 h-3" />
                                    ) : (
                                        <FileText className="w-3 h-3" />
                                    )}
                                    {doc.type?.startsWith('image') ? 'Image' : 'PDF'}
                                </div>

                                {/* Expand overlay */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-white">
                                        <Eye className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete?.(doc._id);
                                    }}
                                    className="absolute top-3 right-3 p-1.5 glass rounded-lg text-surface-300 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 z-10"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h4 className="font-medium text-sm truncate mb-1">{doc.name}</h4>
                                <div className="flex items-center gap-1 text-xs text-surface-300">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(doc.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* AI Summary Section */}
            {selectedDoc && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-surface-800 pt-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <h3 className="font-semibold">AI Report Summary</h3>
                    </div>
                    <AISummary document={selectedDoc} />
                </motion.div>
            )}

            {/* Preview Modal */}
            <AnimatePresence>
                {previewDoc && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-5xl h-[90vh] glass rounded-3xl flex flex-col overflow-hidden shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-surface-800/50 bg-surface-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 glass rounded-xl text-medical-teal">
                                        {previewDoc.type?.startsWith('image') ? <Image className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{previewDoc.name}</h3>
                                        <p className="text-xs text-surface-300">
                                            {new Date(previewDoc.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPreviewDoc(null)}
                                    className="p-2 text-surface-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-auto bg-surface-950 p-4 sm:p-6 flex flex-col items-center justify-center">
                                {previewDoc.type?.startsWith('image') ? (
                                    <img
                                        src={previewDoc.data}
                                        alt={previewDoc.name}
                                        className="max-w-full max-h-full object-contain rounded-xl"
                                    />
                                ) : previewDoc.type === 'application/pdf' ? (
                                    <iframe
                                        src={previewDoc.data}
                                        title={previewDoc.name}
                                        className="w-full h-full rounded-xl bg-white"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <FileText className="w-16 h-16 text-surface-700 mx-auto mb-4" />
                                        <p className="text-surface-300">Preview not available for this file type</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
