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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        const fetchArtistDetails = async () => {
            try {
                setLoading(true);
                const data = await api.get(`/artists/${artistId}/artist-details/`);

                let services = data.services || data.categories || data.specialties || [];
                let slots = data.available_slots || [];

                if (typeof services === 'string') {
                    try { services = JSON.parse(services); } catch (e) { console.error('Failed to parse services', e); services = []; }
                }
                if (typeof slots === 'string') {
                    try { slots = JSON.parse(slots); } catch (e) { console.error('Failed to parse slots', e); slots = []; }
                }

                setArtist({ ...data, services, available_slots: slots });
            } catch (err) {
                setError(err.message || 'Failed to fetch artist details');
            } finally {
                setLoading(false);
            }
        };
        if (artistId) {
            fetchArtistDetails();
        }
    }, [artistId]);

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            setDeleteError('');
            await api.delete(`/artists/${artistId}/artist-details/`);
            onClose(true);
        } catch (err) {
            setDeleteError(err.message || 'Failed to remove artist');
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
                        <button onClick={onClose} className="px-10 py-4 bg-night-bordeaux text-white rounded-2xl font-black text-xs uppercase tracking-widest">Back to artists list</button>
                    </div>
                ) : (
                    <>
                        {/* Visual Identity - Clean Image */}
                        <div className="w-full md:w-2/5 relative h-[300px] md:h-auto">
                            <img
                                src={artist.profile_picture || 'https://images.unsplash.com/photo-1560169897-408472b4f260?w=800'}
                                alt={artist.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-night-bordeaux/20 to-transparent opacity-40" />
                        </div>

                        {/* Details & Actions */}
                        <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto bg-white/40">
                            <div className="space-y-8">
                                {/* Header Info: Name, Brand, Services */}
                                <div>
                                    <h2 className="text-4xl font-heading font-black text-night-bordeaux mb-2">{artist.name}</h2>
                                    <p className="text-lg font-medium text-gray-400 italic mb-4">{artist.brand_name || 'Individual Virtuoso'}</p>

                                    {/* Services/Categories */}
                                    <div className="flex gap-2 flex-wrap mb-6">
                                        {(() => {
                                            const categories = (artist.categories && artist.categories.length > 0)
                                                ? artist.categories
                                                : (artist.specialties || []);

                                            return (
                                                <>
                                                    {categories.map((category, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-night-bordeaux/5 text-night-bordeaux text-[9px] font-black uppercase tracking-tighter rounded-lg border border-night-bordeaux/10">
                                                            {category.name || category}
                                                        </span>
                                                    ))}
                                                    {categories.length === 0 && (
                                                        <span className="px-3 py-1 bg-night-bordeaux/5 text-night-bordeaux text-[9px] font-black uppercase tracking-tighter rounded-lg border border-night-bordeaux/10">
                                                            Artist
                                                        </span>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Reach Out & Location Grid */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-[10px] font-black text-blush-rose uppercase tracking-[0.3em] mb-4">Reach us at</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {artist.instagram && (
                                                <a href={artist.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-xl shadow-md hover:scale-110 transition-all" title="Instagram">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M16.5,6.33A1.17,1.17 0 0,1 17.67,7.5A1.17,1.17 0 0,1 16.5,8.67A1.17,1.17 0 0,1 15.33,7.5A1.17,1.17 0 0,1 16.5,6.33Z" />
                                                    </svg>
                                                </a>
                                            )}
                                            {artist.tiktok && (
                                                <a href={artist.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-xl shadow-md hover:scale-110 transition-all" title="TikTok">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                                    </svg>
                                                </a>
                                            )}
                                            {artist.whatsapp_contact && (
                                                <a href={`https://wa.me/${artist.whatsapp_contact.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-[#25D366] text-white rounded-xl shadow-md hover:scale-110 transition-all" title="WhatsApp">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                        <div className="w-12 h-12 bg-soft-apricot/20 rounded-2xl flex items-center justify-center text-blush-rose">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                                            <p className="text-sm font-bold text-night-bordeaux">{artist.location || 'Kigali, Rwanda'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 w-full" />

                                <div>
                                    <h3 className="text-[10px] font-black text-blush-rose uppercase tracking-[0.3em] mb-4">Open Slots</h3>
                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                        {artist.available_slots?.map((slot, i) => (
                                            <div key={i} className="px-3 py-1.5 bg-soft-apricot/10 border border-soft-apricot/20 rounded-lg text-center">
                                                <p className="text-[9px] font-black text-night-bordeaux">{slot.date}</p>
                                                <p className="text-[8px] font-bold text-gray-400">{slot.time}</p>
                                            </div>
                                        ))}
                                        {(!artist.available_slots || artist.available_slots.length === 0) && (
                                            <p className="text-[10px] font-bold text-gray-400 italic">No available slots</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Booking CTA */}
                            <div className="space-y-4 pt-6 mt-10">
                                <button className="w-full py-5 bg-night-bordeaux text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                                    Book me
                                </button>

                                {(user?.isAdmin || (user?.id && (user.id === artist.user || user.id === artist.user_id || user.id === artist.owner)) || (user?.username && user.username === artist.created_by)) && (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-berry-crush hover:border-berry-crush/30 transition-all bg-white shadow-sm"
                                        title="Remove Artist"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-berry-crush/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-berry-crush" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-heading font-black text-night-bordeaux mb-3">Remove Professional?</h3>
                                <p className="text-gray-500 font-medium mb-8">This action cannot be undone. The artist profile will be permanently removed from the directory.</p>

                                {deleteError && (
                                    <p className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-100">
                                        {deleteError}
                                    </p>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleteLoading}
                                        className="flex-1 px-6 py-3 bg-berry-crush text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-berry-crush/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {deleteLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                Removing...
                                            </>
                                        ) : (
                                            'Delete'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProfessionalDetailsModal;
