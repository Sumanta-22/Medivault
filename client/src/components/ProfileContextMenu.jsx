
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Download, LogOut, X, ShieldAlert, HeartPulse, Activity } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ProfileContextMenu() {
    const { session, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch user profile data for QR and Export
    useEffect(() => {
        if (isOpen || showQR) {
            fetch('/api/profile')
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        setProfileData({ ...data.user, emergencyProfile: data.profile });
                    }
                })
                .catch(err => console.error("Failed to fetch profile", err));
        }
    }, [isOpen, showQR]);

    const handleExportPDF = () => {
        if (!profileData) return;

        const doc = new jsPDF();
        const emergencyData = profileData.emergencyProfile || {};

        // Header
        doc.setFillColor(13, 148, 136); // Medical Teal
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("MediVault", 14, 25);

        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("Emergency Medical Profile", 14, 33);

        // User Info
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Patient Information", 14, 55);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${profileData.name || 'N/A'}`, 14, 65);
        doc.text(`Email: ${profileData.email || 'N/A'}`, 14, 72);

        // Medical specific info
        doc.setDrawColor(226, 232, 240);
        doc.line(14, 80, 196, 80);

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Critical Health Data", 14, 95);

        const basicData = [
            ['Blood Group', emergencyData.bloodGroup || 'Not Specified'],
            ['Allergies', emergencyData.allergies?.length ? emergencyData.allergies.join(', ') : 'None Reported'],
            ['Current Medications', emergencyData.medications?.length ? emergencyData.medications.join(', ') : 'None Reported']
        ];

        doc.autoTable({
            startY: 100,
            head: [['Category', 'Details']],
            body: basicData,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42], textColor: 255 },
            styles: { fontSize: 11, cellPadding: 5 }
        });

        // Emergency Contacts
        if (emergencyData.emergencyContacts && emergencyData.emergencyContacts.length > 0) {
            const finalY = doc.lastAutoTable.finalY || 100;

            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Emergency Contacts", 14, finalY + 15);

            const contactData = emergencyData.emergencyContacts.map(c => [
                c.name, c.relation, c.phone
            ]);

            doc.autoTable({
                startY: finalY + 20,
                head: [['Name', 'Relation', 'Phone Number']],
                body: contactData,
                theme: 'striped',
                headStyles: { fillColor: [13, 148, 136] },
                styles: { fontSize: 11 }
            });
        }

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(`Generated securely by MediVault on ${new Date().toLocaleDateString()}`, 14, 285);
        }

        doc.save(`MediVault_Profile_${profileData.name ? profileData.name.replace(/\s+/g, '_') : 'User'}.pdf`);
        setIsOpen(false);
    };

    // Construct vCard data for QR Code
    const getVCardData = () => {
        if (!profileData) return "";
        const em = profileData.emergencyProfile || {};

        // This format allows first responders to scan and save directly to contacts
        // while also showing medical data in the notes field
        const notes = `BLOOD TYPE: ${em.bloodGroup || 'Unknown'}\\nALLERGIES: ${em.allergies?.join(', ') || 'None'}\\nMEDICATIONS: ${em.medications?.join(', ') || 'None'}`;

        return `BEGIN:VCARD
VERSION:3.0
N:${profileData.name || 'User'};;;
FN:${profileData.name || 'User'}
EMAIL:${profileData.email || ''}
ORG:MediVault Emergency Profile
NOTE:${notes}
${em.emergencyContacts?.map(c => `TEL;type=EMERGENCY;type=VOICE;type=pref:${c.phone}`).join('\n') || ''}
END:VCARD`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Avatar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
            >
                <div className="w-9 h-9 rounded-full bg-gradient-teal flex items-center justify-center text-white font-semibold text-sm shadow-glow-teal ring-2 ring-transparent hover:ring-medical-teal transition-all">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-64 bg-surface-900 border border-surface-800 rounded-2xl shadow-glass-lg overflow-hidden z-50 origin-top-right"
                    >
                        <div className="p-4 border-b border-surface-800 bg-surface-800/30">
                            <p className="font-semibold text-white truncate">{session?.user?.name || 'User'}</p>
                            <p className="text-xs text-surface-300 truncate">{session?.user?.email}</p>
                        </div>

                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => {
                                    setShowQR(true);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-surface-200 hover:text-white hover:bg-surface-800 rounded-xl transition-all"
                            >
                                <QrCode className="w-4 h-4 text-emerald-400" />
                                Medical ID QR Code
                            </button>

                            <button
                                onClick={handleExportPDF}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-surface-200 hover:text-white hover:bg-surface-800 rounded-xl transition-all"
                            >
                                <Download className="w-4 h-4 text-blue-400" />
                                Export Health Summary
                            </button>
                        </div>

                        <div className="p-2 border-t border-surface-800">
                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-surface-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* QR Code Modal */}
            {mounted && typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {showQR && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowQR(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative w-full max-w-sm glass rounded-3xl shadow-2xl z-10 flex flex-col"
                            >
                                <div className="p-4 flex items-center justify-between border-b border-surface-800/50 bg-surface-900/50 rounded-t-3xl">
                                    <div className="flex items-center gap-2">
                                        <ShieldAlert className="w-5 h-5 text-red-400" />
                                        <h3 className="font-semibold text-white">Emergency Medical ID</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowQR(false)}
                                        className="p-1.5 text-surface-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-8 flex flex-col items-center justify-center bg-white">
                                    <QRCodeSVG
                                        value={getVCardData()}
                                        size={200}
                                        level="M"
                                        includeMargin={true}
                                    />
                                    <p className="mt-4 text-sm font-medium text-slate-600 text-center">
                                        Scan with any smartphone camera to save emergency contact & medical data
                                    </p>
                                </div>

                                {profileData?.emergencyProfile?.bloodGroup && (
                                    <div className="p-4 bg-red-500/10 border-t border-red-500/20 flex items-center justify-center gap-3 rounded-b-3xl">
                                        <HeartPulse className="w-5 h-5 text-red-500" />
                                        <span className="font-bold text-red-500 font-mono text-lg">
                                            BLOOD: {profileData.emergencyProfile.bloodGroup}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
