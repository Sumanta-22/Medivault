'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, FolderOpen, Upload } from 'lucide-react';
import Link from 'next/link';
import DocumentCarousel from '@/components/DocumentCarousel';
import ScanUploadFAB from '@/components/ScanUploadFAB';

export default function FolderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [folder, setFolder] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [allFolders, setAllFolders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFolder();
        fetchAllFolders();
    }, [params.id]);

    const fetchFolder = async () => {
        try {
            const res = await fetch(`/api/folders/${params.id}`);
            const data = await res.json();
            setFolder(data.folder);
            setDocuments(data.documents || []);
        } catch (err) {
            console.error('Failed to fetch folder:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllFolders = async () => {
        try {
            const res = await fetch('/api/folders');
            const data = await res.json();
            setAllFolders(data.folders || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpload = async (uploadData) => {
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...uploadData, folderId: params.id }),
            });
            if (res.ok) {
                fetchFolder();
            }
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    const handleDeleteDoc = async (docId) => {
        try {
            const res = await fetch(`/api/upload?id=${docId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchFolder();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="h-12 w-48 skeleton rounded-xl mb-8" />
                <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="aspect-[4/3] skeleton rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8"
            >
                <button
                    onClick={() => router.push('/dashboard')}
                    className="p-2.5 glass rounded-xl text-surface-300 hover:text-white hover:bg-white/10 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${folder?.color || '#0d9488'}20` }}
                    >
                        {folder?.icon || '📁'}
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold">{folder?.name || 'Folder'}</h1>
                        <p className="text-sm text-surface-300">{documents.length} documents</p>
                    </div>
                </div>
            </motion.div>

            {/* Document Carousel */}
            <DocumentCarousel documents={documents} onDelete={handleDeleteDoc} />

            {/* Scan & Upload FAB */}
            <ScanUploadFAB folders={allFolders} onUpload={handleUpload} />
        </div>
    );
}
