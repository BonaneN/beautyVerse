import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProfessionalDetailsModal = ({ artistId, onClose }) => {
    const { user } = useAuth();
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchArtistDetails = async () => {
            try {
                setLoading(true);
                const data = await api.get(`/artists/${artistId}/artist-details/`);
                setArtist(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch artist details');
            } finally {
                setLoading(false);
            }
        };
        if (artistId) fetchArtistDetails();
    }, [artistId]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to remove this professional?')) return;

        try {
            setDeleteLoading(true);
            await api.delete(`/artists/${artistId}/delete-artist/`);
            onClose(true);
        } catch (err) {
            alert(err.message || 'Failed to remove artist');
        } finally {
            setDeleteLoading(false);
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
        exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }
    };

    if (!artistId) return null;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
            <div className="absolute inset-0 bg-night-bordeaux/40 backdrop-blur-md" onClick={onClose} />

            <motion.div
                variants={modalVariants}
                className="relative w-full max-w-5xl bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-premium overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center text-night-bordeaux transition-all hover:rotate-90"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {loading ? (
                    <div className="w-full h-96 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-cotton-candy border-t-blush-rose"></div>
                    </div>
                ) : error ? (
                    <div className="w-full p-20 text-center">
                        <h2 className="text-3xl font-black text-berry-crush mb-4">Discovery Error</h2>
                        <button onClick={onClose} className="px-10 py-4 bg-night-bordeaux text-white rounded-2xl font-black text-xs uppercase tracking-widest">Back to Directory</button>
                    </div>
                ) : (
                    <>
                        {/* Visual Identity */}
                        <div className="w-full md:w-2/5 relative h-[300px] md:h-auto">
                            <img
                                src={artist.profile_picture || 'https://images.unsplash.com/photo-1560169897-408472b4f260?w=800'}
                                alt={artist.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-night-bordeaux via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <span className="text-[10px] font-black text-soft-apricot uppercase tracking-[0.3em] mb-2 block">Premium Artistry</span>
                                <h2 className="text-4xl font-heading font-black leading-tight mb-2">{artist.name}</h2>
                                <p className="text-lg font-medium opacity-90 italic">"{artist.brand_name || 'Individual Virtuoso'}"</p>
                            </div>
                        </div>

                        {/* Details & Actions */}
                        <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto bg-white/40">
                            <div className="space-y-10">
                                {/* Socials & Contact Chips */}
                                <div className="flex flex-wrap gap-3">
                                    {artist.instagram && (
                                        <a href={artist.instagram} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-105 transition-all flex items-center gap-2">
                                            Instagram
                                        </a>
                                    )}
                                    {artist.tiktok && (
                                        <a href={artist.tiktok} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-105 transition-all flex items-center gap-2">
                                            TikTok
                                        </a>
                                    )}
                                    {artist.whatsapp_contact && (
                                        <a href={`https://wa.me/${artist.whatsapp_contact.replace(/\D/g, '')}`} className="px-4 py-2 bg-[#25D366] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-105 transition-all flex items-center gap-2">
                                            WhatsApp
                                        </a>
                                    )}
                                    {artist.phone && (
                                        <a href={`tel:${artist.phone}`} className="px-4 py-2 bg-night-bordeaux text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-105 transition-all flex items-center gap-2">
                                            Call
                                        </a>
                                    )}
                                </div>

                                {/* Philosophy */}
                                <div>
                                    <h3 className="text-[10px] font-black text-blush-rose uppercase tracking-[0.3em] mb-4">Philosophy</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed font-medium italic">
                                        "{artist.bio || "Dedicated to elevating natural beauty through refined expertise and artistic vision."}"
                                    </p>
                                </div>

                                {/* Location & Availability */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                        <div className="w-12 h-12 bg-soft-apricot/20 rounded-2xl flex items-center justify-center text-blush-rose">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sanctuary</p>
                                            <p className="text-sm font-bold text-night-bordeaux">{artist.location || 'Kigali, Rwanda'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[10px] font-black text-blush-rose uppercase tracking-[0.3em] mb-4">Open Slots</h3>
                                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                            {artist.available_slots?.filter(slot => !slot.is_booked).map((slot, i) => (
                                                <div key={i} className="px-3 py-1.5 bg-soft-apricot/10 border border-soft-apricot/20 rounded-lg text-center">
                                                    <p className="text-[9px] font-black text-night-bordeaux">{slot.date}</p>
                                                    <p className="text-[8px] font-bold text-gray-400">{slot.time}</p>
                                                </div>
                                            ))}
                                            {(!artist.available_slots || artist.available_slots.filter(s => !s.is_booked).length === 0) && (
                                                <p className="text-[10px] font-bold text-gray-400 italic">No available slots</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Booking CTA */}
                                <div className="space-y-4 pt-6">
                                    <button className="w-full py-5 bg-night-bordeaux text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                                        Commence Booking
                                    </button>

                                    {user && user.isAdmin && (
                                        <button
                                            onClick={handleDelete}
                                            disabled={deleteLoading}
                                            className="w-full py-4 border border-berry-crush text-berry-crush rounded-[2rem] font-black text-[9px] uppercase tracking-[0.2em] hover:bg-berry-crush hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {deleteLoading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            )}
                                            Admin: Remove Professional
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ProfessionalDetailsModal;
