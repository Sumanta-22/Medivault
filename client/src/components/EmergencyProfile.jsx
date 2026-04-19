
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Heart,
    Droplets,
    AlertTriangle,
    Pill,
    Phone,
    Plus,
    X,
    Save,
    Check,
    User,
    Loader2,
} from 'lucide-react';

export default function EmergencyProfile() {
    const [profile, setProfile] = useState({
        bloodGroup: '',
        allergies: [],
        medications: [],
        emergencyContacts: [],
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [newAllergy, setNewAllergy] = useState('');
    const [newMedication, setNewMedication] = useState('');
    const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile');
            const data = await res.json();
            if (data.profile) {
                setProfile(data.profile);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emergencyProfile: profile }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const addAllergy = () => {
        if (!newAllergy.trim()) return;
        setProfile({ ...profile, allergies: [...profile.allergies, newAllergy.trim()] });
        setNewAllergy('');
    };

    const addMedication = () => {
        if (!newMedication.trim()) return;
        setProfile({ ...profile, medications: [...profile.medications, newMedication.trim()] });
        setNewMedication('');
    };

    const addContact = () => {
        if (!newContact.name || !newContact.phone) return;
        setProfile({
            ...profile,
            emergencyContacts: [...profile.emergencyContacts, { ...newContact }],
        });
        setNewContact({ name: '', phone: '', relation: '' });
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 skeleton rounded-2xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                    Emergency <span className="text-gradient">Medical Profile</span>
                </h1>
                <p className="text-surface-300">Quick-access critical medical information</p>
            </motion.div>

            {/* Blood Group */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                        <Droplets className="w-5 h-5 text-red-400" />
                    </div>
                    <h2 className="font-semibold">Blood Group</h2>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <button
                            key={bg}
                            onClick={() => setProfile({ ...profile, bloodGroup: bg })}
                            className={`py-3 rounded-xl text-sm font-semibold transition-all ${profile.bloodGroup === bg
                                    ? 'bg-red-500 text-white shadow-emergency'
                                    : 'bg-surface-800 text-surface-300 hover:bg-surface-700'
                                }`}
                        >
                            {bg}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Allergies */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <h2 className="font-semibold">Allergies</h2>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                    {profile.allergies.map((allergy, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-400 flex items-center gap-1"
                        >
                            {allergy}
                            <button
                                onClick={() =>
                                    setProfile({
                                        ...profile,
                                        allergies: profile.allergies.filter((_, i) => i !== idx),
                                    })
                                }
                                className="ml-1 hover:text-amber-300"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addAllergy()}
                        className="flex-1 px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white text-sm placeholder-surface-300 transition-all"
                        placeholder="Add allergy (e.g., Penicillin)"
                    />
                    <button onClick={addAllergy} className="px-4 py-2.5 bg-amber-500/15 text-amber-400 rounded-xl hover:bg-amber-500/25 transition-all">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            {/* Medications */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                        <Pill className="w-5 h-5 text-green-400" />
                    </div>
                    <h2 className="font-semibold">Current Medications</h2>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                    {profile.medications.map((med, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400 flex items-center gap-1"
                        >
                            {med}
                            <button
                                onClick={() =>
                                    setProfile({
                                        ...profile,
                                        medications: profile.medications.filter((_, i) => i !== idx),
                                    })
                                }
                                className="ml-1 hover:text-green-300"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMedication}
                        onChange={(e) => setNewMedication(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addMedication()}
                        className="flex-1 px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white text-sm placeholder-surface-300 transition-all"
                        placeholder="Add medication (e.g., Metformin 500mg)"
                    />
                    <button onClick={addMedication} className="px-4 py-2.5 bg-green-500/15 text-green-400 rounded-xl hover:bg-green-500/25 transition-all">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="font-semibold">Emergency Contacts</h2>
                </div>
                <div className="space-y-2 mb-4">
                    {profile.emergencyContacts.map((contact, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-surface-800/50 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{contact.name}</p>
                                    <p className="text-xs text-surface-300">
                                        {contact.relation} · {contact.phone}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="p-2 text-blue-400 hover:bg-blue-500/15 rounded-lg transition-all"
                                >
                                    <Phone className="w-4 h-4" />
                                </a>
                                <button
                                    onClick={() =>
                                        setProfile({
                                            ...profile,
                                            emergencyContacts: profile.emergencyContacts.filter((_, i) => i !== idx),
                                        })
                                    }
                                    className="p-2 text-red-400 hover:bg-red-500/15 rounded-lg transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border border-dashed border-surface-700 rounded-xl space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            value={newContact.name}
                            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                            className="px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white text-sm placeholder-surface-300 transition-all"
                            placeholder="Name"
                        />
                        <input
                            type="tel"
                            value={newContact.phone}
                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                            className="px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white text-sm placeholder-surface-300 transition-all"
                            placeholder="Phone"
                        />
                        <input
                            type="text"
                            value={newContact.relation}
                            onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                            className="px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-white text-sm placeholder-surface-300 transition-all"
                            placeholder="Relation"
                        />
                    </div>
                    <button
                        onClick={addContact}
                        className="w-full py-2.5 border border-blue-500/30 text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-500/10 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Contact
                    </button>
                </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-4 bg-gradient-teal text-white rounded-2xl font-semibold shadow-glow-teal hover:shadow-[0_0_30px_rgba(13,148,136,0.4)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : saved ? (
                        <>
                            <Check className="w-5 h-5" />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Profile
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
}
