
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, FileText, Image, Check, Plus } from 'lucide-react';

export default function ScanUploadFAB({ folders, onUpload }) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState(null); // 'camera' | 'file'
    const [selectedFolder, setSelectedFolder] = useState('');
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const startCamera = async () => {
        setMode('camera');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Camera access denied:', err);
            setMode(null);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setPreview({ type: 'image', data: dataUrl, name: `scan_${Date.now()}.jpg` });
        stopCamera();
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            setPreview({
                type: file.type.startsWith('image/') ? 'image' : 'file',
                data: ev.target.result,
                name: file.name,
                file,
            });
        };
        reader.readAsDataURL(file);
        setMode('file');
    };

    const handleUpload = async () => {
        if (!preview || !selectedFolder) return;
        setUploading(true);

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        onUpload({
            folderId: selectedFolder,
            name: preview.name,
            type: preview.type === 'image' ? 'image/jpeg' : 'application/pdf',
            data: preview.data,
        });

        setUploading(false);
        setPreview(null);
        setMode(null);
        setOpen(false);
    };

    const handleClose = () => {
        stopCamera();
        setPreview(null);
        setMode(null);
        setOpen(false);
    };

    return (
        <>
            {/* FAB */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-teal text-white rounded-2xl shadow-glow-teal hover:shadow-[0_0_40px_rgba(13,148,136,0.5)] transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
            >
                <Plus className="w-7 h-7" />
            </button>

            {/* Upload Modal */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            className="fixed inset-x-4 bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:bottom-8 md:w-full md:max-w-md z-50"
                        >
                            <div className="bg-surface-900 border border-surface-700 rounded-3xl shadow-glass-lg overflow-hidden">
                                {/* Header */}
                                <div className="p-5 flex items-center justify-between border-b border-surface-800">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Upload className="w-5 h-5 text-medical-teal" />
                                        Scan & Upload
                                    </h3>
                                    <button
                                        onClick={handleClose}
                                        className="p-2 text-surface-300 hover:text-white hover:bg-surface-800 rounded-xl transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-5 space-y-4">
                                    {!mode && !preview && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={startCamera}
                                                className="flex flex-col items-center gap-3 p-6 glass-light rounded-2xl hover:bg-white/[0.06] transition-all"
                                            >
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                                                    <Camera className="w-7 h-7 text-white" />
                                                </div>
                                                <span className="text-sm font-medium">Scan Document</span>
                                            </button>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex flex-col items-center gap-3 p-6 glass-light rounded-2xl hover:bg-white/[0.06] transition-all"
                                            >
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                                    <FileText className="w-7 h-7 text-white" />
                                                </div>
                                                <span className="text-sm font-medium">Upload File</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Camera View */}
                                    {mode === 'camera' && !preview && (
                                        <div className="space-y-3">
                                            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    playsInline
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                onClick={capturePhoto}
                                                className="w-full py-3.5 bg-gradient-teal text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                                            >
                                                <Camera className="w-4 h-4" />
                                                Capture
                                            </button>
                                        </div>
                                    )}

                                    {/* Preview */}
                                    {preview && (
                                        <div className="space-y-4">
                                            <div className="relative rounded-2xl overflow-hidden bg-surface-800 aspect-[4/3] flex items-center justify-center">
                                                {preview.type === 'image' ? (
                                                    <img
                                                        src={preview.data}
                                                        alt="Preview"
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-surface-300">
                                                        <FileText className="w-12 h-12" />
                                                        <span className="text-sm">{preview.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Folder selector */}
                                            <select
                                                value={selectedFolder}
                                                onChange={(e) => setSelectedFolder(e.target.value)}
                                                className="w-full px-4 py-3.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white transition-all"
                                            >
                                                <option value="">Select folder…</option>
                                                {folders?.map((f) => (
                                                    <option key={f._id} value={f._id}>
                                                        {f.icon} {f.name}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                onClick={handleUpload}
                                                disabled={!selectedFolder || uploading}
                                                className="w-full py-3.5 bg-gradient-teal text-white rounded-xl font-semibold shadow-glow-teal transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {uploading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Upload
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
            />
        </>
    );
}
