import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ambulance, Phone, MapPin, X, Navigation, Building2, AlertTriangle } from 'lucide-react';

const MOCK_HOSPITALS = [
    { name: 'City General Hospital', distance: '1.2 km', phone: '108', rating: 4.5 },
    { name: 'Apollo Emergency Center', distance: '2.5 km', phone: '1066', rating: 4.8 },
    { name: 'Max Super Speciality', distance: '3.1 km', phone: '011-26515050', rating: 4.7 },
    { name: 'AIIMS Trauma Centre', distance: '4.0 km', phone: '011-26588500', rating: 4.9 },
];

export default function EmergencyButton() {
    const [open, setOpen] = useState(false);
    const [location, setLocation] = useState(null);
    const [locating, setLocating] = useState(false);
    const [locError, setLocError] = useState('');
    const detectLocation = () => {
        setLocating(true);
        setLocError('');

        if (!navigator.geolocation) {
            setLocError('Geolocation is not supported by your browser');
            setLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLocating(false);
            },
            (error) => {
                setLocError('Unable to detect your location. Please enable GPS.');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleOpen = () => {
        setOpen(true);
        detectLocation();
    };

    return (
        <>
            {/* SOS Button */}
            <button
                onClick={handleOpen}
                className="emergency-pulse flex items-center gap-2.5 px-6 py-3 bg-gradient-emergency text-white rounded-2xl font-bold text-sm shadow-emergency hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
            >
                <Ambulance className="w-5 h-5" />
                <span>Emergency SOS</span>
            </button>

            {/* Emergency Modal */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-[61] max-h-[80vh] overflow-y-auto"
                        >
                            <div className="bg-surface-900 border border-red-500/20 rounded-3xl shadow-2xl">
                                {/* Header */}
                                <div className="bg-gradient-emergency p-6 rounded-t-3xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <AlertTriangle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">Emergency SOS</h2>
                                            <p className="text-red-100 text-sm">Get immediate help</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Quick Call Buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <a
                                            href="tel:108"
                                            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gradient-emergency flex items-center justify-center">
                                                <Ambulance className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">Ambulance</div>
                                                <div className="text-xs text-surface-300">Call 108</div>
                                            </div>
                                        </a>
                                        <a
                                            href="tel:112"
                                            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">Emergency</div>
                                                <div className="text-xs text-surface-300">Call 112</div>
                                            </div>
                                        </a>
                                    </div>

                                    {/* Location */}
                                    <div className="p-4 glass-light rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Navigation className="w-4 h-4 text-medical-teal" />
                                            <span className="text-sm font-medium">Your Location</span>
                                        </div>
                                        {locating ? (
                                            <div className="flex items-center gap-2 text-surface-300 text-sm">
                                                <div className="w-4 h-4 border-2 border-medical-teal/30 border-t-medical-teal rounded-full animate-spin" />
                                                Detecting your location…
                                            </div>
                                        ) : locError ? (
                                            <p className="text-red-400 text-sm">{locError}</p>
                                        ) : location ? (
                                            <p className="text-surface-300 text-sm">
                                                Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                                            </p>
                                        ) : null}
                                    </div>

                                    {/* Nearby Hospitals */}
                                    <div>
                                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-medical-teal" />
                                            Nearest Hospitals
                                        </h3>
                                        <div className="space-y-2">
                                            {MOCK_HOSPITALS.map((hospital) => (
                                                <div
                                                    key={hospital.name}
                                                    className="flex items-center justify-between p-4 glass-light rounded-xl hover:bg-white/[0.06] transition-all"
                                                >
                                                    <div className="flex-1">
                                                        <div className="font-medium text-sm">{hospital.name}</div>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-xs text-surface-300 flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {hospital.distance}
                                                            </span>
                                                            <span className="text-xs text-amber-400">★ {hospital.rating}</span>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={`tel:${hospital.phone}`}
                                                        className="p-2.5 bg-medical-teal/15 text-medical-teal rounded-xl hover:bg-medical-teal/25 transition-all"
                                                    >
                                                        <Phone className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
