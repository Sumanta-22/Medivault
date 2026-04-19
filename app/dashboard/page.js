'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    FolderOpen,
    Plus,
    Search,
    MoreVertical,
    Pencil,
    Trash2,
    FileText,
    Clock,
} from 'lucide-react';
import CreateFolderModal from '@/components/CreateFolderModal';
import ScanUploadFAB from '@/components/ScanUploadFAB';

export default function DashboardPage() {
    const { data: session } = useSession();
    const [folders, setFolders] = useState([]);
    const [search, setSearch] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const [editFolder, setEditFolder] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            const res = await fetch('/api/folders');
            const data = await res.json();
            setFolders(data.folders || []);
        } catch (err) {
            console.error('Failed to fetch folders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFolder = async (folderData) => {
        try {
            if (editFolder) {
                const res = await fetch(`/api/folders/${editFolder._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(folderData),
                });
                if (res.ok) {
                    fetchFolders();
                }
            } else {
                const res = await fetch('/api/folders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(folderData),
                });
                if (res.ok) {
                    fetchFolders();
                }
            }
        } catch (err) {
            console.error('Failed to create/update folder:', err);
        }
        setEditFolder(null);
    };

    const handleDeleteFolder = async (folderId) => {
        try {
            const res = await fetch(`/api/folders/${folderId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchFolders();
            }
        } catch (err) {
            console.error('Failed to delete folder:', err);
        }
        setContextMenu(null);
    };

    const handleUpload = async (uploadData) => {
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(uploadData),
            });
            if (res.ok) {
                fetchFolders();
            }
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    const filteredFolders = folders.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto" onClick={() => setContextMenu(null)}>
            {/* Welcome */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                    Welcome back, <span className="text-gradient">{session?.user?.name?.split(' ')[0] || 'User'}</span>
                </h1>
                <p className="text-surface-300">Manage your medical records securely</p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                {[
                    { label: 'Total Folders', value: folders.length, icon: FolderOpen, color: 'text-medical-teal' },
                    { label: 'Documents', value: folders.reduce((acc, f) => acc + (f.documents?.length || 0), 0), icon: FileText, color: 'text-primary-400' },
                    { label: 'Last Upload', value: 'Today', icon: Clock, color: 'text-amber-400' },
                    { label: 'Account', value: session?.user?.accountType === 'family' ? 'Family' : 'Individual', icon: null, color: 'text-green-400' },
                ].map((stat) => (
                    <div key={stat.label} className="glass rounded-2xl p-4">
                        <p className="text-xs text-surface-300 mb-1">{stat.label}</p>
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </motion.div>

            {/* Search + Add */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-6"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-surface-800/50 border border-surface-700 rounded-xl text-white placeholder-surface-300 transition-all"
                        placeholder="Search folders…"
                    />
                </div>
                <button
                    onClick={() => { setEditFolder(null); setCreateOpen(true); }}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-teal text-white rounded-xl font-medium shadow-glow-teal hover:shadow-[0_0_25px_rgba(13,148,136,0.4)] transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden md:inline">New Folder</span>
                </button>
            </motion.div>

            {/* Folders Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-2xl skeleton" />
                    ))}
                </div>
            ) : filteredFolders.length === 0 ? (
                <div className="text-center py-20">
                    <FolderOpen className="w-16 h-16 text-surface-700 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-surface-300 mb-2">No folders yet</h3>
                    <p className="text-sm text-surface-300 mb-6">Create your first folder to start organizing medical records</p>
                    <button
                        onClick={() => setCreateOpen(true)}
                        className="px-6 py-3 bg-gradient-teal text-white rounded-xl font-medium shadow-glow-teal"
                    >
                        <Plus className="w-4 h-4 inline mr-2" />
                        Create Folder
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredFolders.map((folder, index) => (
                        <motion.div
                            key={folder._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className="relative group"
                        >
                            <Link href={`/dashboard/folder/${folder._id}`}>
                                <div
                                    className="folder-card glass rounded-2xl p-6 cursor-pointer aspect-square flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                                >
                                    {/* Color accent */}
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1 opacity-80"
                                        style={{ backgroundColor: folder.color }}
                                    />
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                                        style={{ backgroundColor: `${folder.color}20` }}
                                    >
                                        {folder.icon || '📁'}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-semibold text-sm">{folder.name}</h3>
                                        <p className="text-xs text-surface-300 mt-1">
                                            {folder.documents?.length || 0} documents
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* Context Menu Button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setContextMenu(contextMenu === folder._id ? null : folder._id);
                                }}
                                className="absolute top-3 right-3 p-1.5 text-surface-300 hover:text-white hover:bg-surface-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Context Menu */}
                            {contextMenu === folder._id && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute top-10 right-3 bg-surface-800 border border-surface-700 rounded-xl shadow-lg z-20 py-1 min-w-[140px]"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditFolder(folder);
                                            setCreateOpen(true);
                                            setContextMenu(null);
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-700 transition-all"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        Rename
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteFolder(folder._id);
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create/Edit Folder Modal */}
            <CreateFolderModal
                open={createOpen}
                onClose={() => { setCreateOpen(false); setEditFolder(null); }}
                onCreated={handleCreateFolder}
                editFolder={editFolder}
            />

            {/* Scan & Upload FAB */}
            <ScanUploadFAB folders={folders} onUpload={handleUpload} />
        </div>
    );
}
