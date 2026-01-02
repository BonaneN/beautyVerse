import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import AddProfessionalForm from '../components/professionals/AddProfessionalForm';
import ProfessionalDetailsModal from './ProfessionalDetails';

const Professionals = () => {
    const { user } = useAuth();
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedArtistId, setSelectedArtistId] = useState(null);

    const fetchArtists = async () => {
        try {
            setLoading(true);
            const data = await api.get('/artists/list-artists/');

            const parsedData = (data || []).map(artist => {
                let services = artist.services || [];
                let slots = artist.available_slots || [];

                // Standardizing the services/categories data from your form
                if (typeof services === 'string') {
                    try { services = JSON.parse(services); } catch (e) { services = []; }
                }
                if (typeof slots === 'string') {
                    try { slots = JSON.parse(slots); } catch (e) { slots = []; }
                }

                return { ...artist, services, available_slots: slots };
            });

            setArtists(parsedData);
        } catch (err) {
            setError(err.message || 'Failed to fetch professionals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    const handleArtistAdded = (newArtist) => {
        setArtists(prev => [...prev, newArtist]);
        setShowAddForm(false);
    };

    return (
        <div className="min-h-screen bg-[#FCF8F4] text-night-bordeaux">
            {/* Hero Section */}
            <div className="relative pt-32 pb-16 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-1.5 bg-soft-apricot/30 border border-soft-apricot rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-blush-rose mb-6">
                        The Beauty Artists
                    </span>
                    <h1 className="text-5xl md:text-6xl font-heading font-black text-night-bordeaux mb-4">
                        Our professionals
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium mb-12">
                        Connect with first-class service providers meticulously curated for your unique essence.
                    </p>

                    <div className="flex justify-center gap-4">
                        {user ? (
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-premium hover:shadow-2xl hover:-translate-y-1 ${showAddForm
                                    ? 'bg-night-bordeaux text-white'
                                    : 'bg-gradient-to-r from-blush-rose to-berry-crush text-white'
                                    }`}
                            >
                                {showAddForm ? 'View Artists' : 'Become an Artist'}
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="px-10 py-4 bg-white border border-gray-200 text-night-bordeaux rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
                            >
                                Login to Join
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="container-custom pb-32 px-4">
                {/* Add Artist Form */}
                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-20 overflow-hidden"
                        >
                            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-premium border border-gray-100">
                                <AddProfessionalForm onArtistAdded={handleArtistAdded} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[3/4] rounded-[2.5rem] bg-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {artists.map((artist, index) => (
                            <motion.div
                                key={artist.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedArtistId(artist.id)}
                                className="group relative cursor-pointer"
                            >
                                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden relative shadow-lg group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-500 border border-white">
                                    {/* Artist Image */}
                                    <img
                                        src={artist.profile_picture || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'}
                                        alt={artist.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-night-bordeaux/90 via-night-bordeaux/20 to-transparent" />

                                    {/* Information Container */}
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <span className="text-[10px] font-black text-soft-apricot uppercase tracking-[0.2em] mb-1 block">
                                            {artist.brand_name || 'Individual Artist'}
                                        </span>
                                        
                                        {/* Artist Name */}
                                        <h3 className="text-3xl font-heading font-black text-white mb-4">
                                            {artist.name}
                                        </h3>
                                        
                                        {/* Dynamic Service Categories */}
                                        <div className="flex gap-2 flex-wrap">
                                            {(() => {
                                                const serviceList = (artist.services || [])
                                                    .map(s => typeof s === 'object' ? s.category : s)
                                                    .filter(Boolean);

                                                const displayList = serviceList.length > 0 
                                                    ? serviceList 
                                                    : (artist.categories || artist.specialties || []);

                                                if (displayList.length > 0) {
                                                    return displayList.slice(0, 2).map((cat, idx) => (
                                                        <span key={idx} className="px-5 py-2 bg-white/15 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 shadow-sm">
                                                            {typeof cat === 'object' ? cat.name : cat}
                                                        </span>
                                                    ));
                                                }

                                                return (
                                                    <span className="px-5 py-2 bg-white/10 backdrop-blur-md text-white/80 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5">
                                                        Professional
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Floating Arrow */}
                                    <div className="absolute top-8 right-8 w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 border border-white/30">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedArtistId && (
                    <ProfessionalDetailsModal
                        artistId={selectedArtistId}
                        onClose={() => setSelectedArtistId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Professionals;