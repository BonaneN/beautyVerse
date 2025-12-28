import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const services = [
    { title: 'Hair Styling', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800', desc: 'Expert cuts, coloring, and styling for every hair type.', specialtyKeyword: 'Hair' },
    { title: 'Makeup Artistry', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800', desc: 'Flawless makeup for weddings, events, and photoshoots.', specialtyKeyword: 'Makeup' },
    { title: 'Skincare', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800', desc: 'Rejuvenating facials and clinical skincare treatments.', specialtyKeyword: 'Skin' },
    { title: 'Nail Care', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', desc: 'Luxury manicures and pedicures with a creative touch.', specialtyKeyword: 'Nail' }
];

const ArtistCard = ({ artist, index }) => {
    // Fallback specialties if null
    const displaySpecialties = Array.isArray(artist.specialties)
        ? artist.specialties
        : (typeof artist.specialties === 'string' ? artist.specialties.split(',').map(s => s.trim()) : ['Artist']);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
        >
            <Link to={`/professionals/${artist.id}`} className="block">
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden relative shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                    <img
                        src={artist.profile_picture || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night-bordeaux/90 via-night-bordeaux/20 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6">
                        <span className="text-[10px] font-black text-soft-apricot uppercase tracking-widest mb-1 block">
                            {artist.brand_name || 'Glow Studio'}
                        </span>
                        <h3 className="text-xl font-heading font-black text-white mb-2">{artist.name}</h3>
                        <div className="flex gap-2 flex-wrap">
                            {displaySpecialties.slice(0, 2).map(s => (
                                <span key={s} className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[8px] font-black uppercase tracking-tighter text-white">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const BookingProcessFlow = () => {
    const steps = [
        {
            id: 1,
            label: 'Select Service',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            pos: 'top-0 left-1/2 -translate-x-1/2'
        },
        {
            id: 2,
            label: 'Pick Artist',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            pos: 'top-1/2 right-0 -translate-y-1/2'
        },
        {
            id: 3,
            label: 'Choose Time',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002-2z" />
                </svg>
            ),
            pos: 'bottom-0 left-1/2 -translate-x-1/2'
        },
        {
            id: 4,
            label: 'Get Glowing!',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
            ),
            pos: 'top-1/2 left-0 -translate-y-1/2',
            glow: true
        }
    ];

    return (
        <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Circular Path Decoration */}
            <div className="absolute inset-8 border-2 border-dashed border-white/20 rounded-full" />

            {/* Steps */}
            {steps.map((step) => (
                <div
                    key={step.id}
                    className={`absolute ${step.pos} flex flex-col items-center group transition-all duration-500`}
                >
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg text-white group-hover:scale-110 group-hover:bg-white/20 ${step.glow ? 'bg-gradient-to-br from-soft-apricot to-blush-rose !text-night-bordeaux shadow-[0_0_30px_rgba(247,173,151,0.6)]' : ''
                        }`}>
                        {step.icon}
                    </div>
                    <span className={`absolute -bottom-6 md:-bottom-8 whitespace-nowrap text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-opacity duration-500 opacity-60 group-hover:opacity-100 italic ${step.glow ? 'text-soft-apricot !opacity-100 not-italic' : 'text-white'
                        }`}>
                        {step.label}
                    </span>
                </div>
            ))}

            {/* Visual Flow Arcs (Conceptual representation) */}
            <svg className="absolute inset-0 w-full h-full -z-10 opacity-30" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="text-white" />
                <motion.circle
                    cx="50" cy="50" r="35"
                    fill="none"
                    stroke="url(#glowGradient)"
                    strokeWidth="1"
                    strokeDasharray="10 100"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <defs>
                    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F7AD97" />
                        <stop offset="100%" stopColor="#B74868" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

const Services = () => {
    const [selectedService, setSelectedService] = useState(null);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setLoading(true);
                const data = await api.get('/artists/list-artists/');
                setArtists(data || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch artists');
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, []);

    const filteredArtists = selectedService
        ? artists.filter(artist => {
            const specialties = artist.specialties;
            const keyword = selectedService.specialtyKeyword.toLowerCase();

            if (Array.isArray(specialties)) {
                return specialties.some(s => s.toLowerCase().includes(keyword));
            } else if (typeof specialties === 'string') {
                return specialties.toLowerCase().includes(keyword);
            }
            return false;
        })
        : [];

    return (
        <div className="min-h-screen bg-[#FCF8F4] text-night-bordeaux">
            {/* Hero Section */}
            <div className="relative pt-10 pb-4 px-4 overflow-hidden text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                </motion.div>
            </div>

            {/* Services Grid */}
            <div className="container-custom pb-32">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <motion.button
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedService(selectedService?.title === service.title ? null : service)}
                            className={`aspect-[4/5] rounded-3xl transition-all duration-500 text-left relative group overflow-hidden border-4 ${selectedService?.title === service.title
                                    ? 'border-blush-rose shadow-[0_20px_40px_-15px_rgba(183,72,104,0.3)] scale-[1.02]'
                                    : 'border-transparent shadow-sm hover:shadow-xl hover:scale-[1.01]'
                                }`}
                        >
                            <img
                                src={service.image}
                                alt={service.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t from-night-bordeaux/90 via-night-bordeaux/20 to-transparent transition-opacity duration-500 ${selectedService?.title === service.title ? 'opacity-100' : 'opacity-80 group-hover:opacity-90'
                                }`} />

                            <div className="absolute bottom-6 left-6 right-6">
                                <h3 className="text-2xl font-black text-white">{service.title}</h3>
                            </div>

                            {selectedService?.title === service.title && (
                                <div className="absolute top-6 right-6 w-8 h-8 bg-blush-rose rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Artist Results Section */}
                <AnimatePresence mode="wait">
                    {selectedService && (
                        <motion.div
                            key={selectedService.title}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="mt-20 pt-20 border-t border-gray-100"
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                                <div>
                                    <span className="text-[10px] font-black text-blush-rose uppercase tracking-[0.3em] block mb-2">Available Experts</span>
                                    <h2 className="text-4xl font-heading font-black text-night-bordeaux">
                                        Specialists in {selectedService.title}
                                    </h2>
                                </div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                    {filteredArtists.length} Artists Found
                                </p>
                            </div>

                            {loading ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="aspect-[3/4] rounded-[2rem] bg-gray-50 animate-pulse border border-gray-100" />
                                    ))}
                                </div>
                            ) : filteredArtists.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {filteredArtists.map((artist, index) => (
                                        <ArtistCard key={artist.id} artist={artist} index={index} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    <div className="text-center py-16 bg-soft-apricot/5 rounded-[3rem] border border-dashed border-soft-apricot/20">
                                        <h3 className="text-xl font-bold text-gray-400 mb-2">Specific Specialists Not Found</h3>
                                        <p className="text-gray-400 max-w-sm mx-auto font-medium text-sm">
                                            We're currently expanding our network of {selectedService.title} experts in your area.
                                        </p>
                                    </div>

                                    {/* Fallback: Show all artists as "Featured Talent" */}
                                    {artists.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="pt-12 border-t border-gray-100"
                                        >
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="h-px bg-gray-100 flex-grow" />
                                                <h3 className="text-[10px] font-black text-blush-rose uppercase tracking-[0.4em] whitespace-nowrap">
                                                    Featured Talent You Might Love
                                                </h3>
                                                <div className="h-px bg-gray-100 flex-grow" />
                                            </div>
                                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                                {artists.map((artist, index) => (
                                                    <ArtistCard key={artist.id} artist={artist} index={index} />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Premium CTA */}
            <div className="container-custom pb-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative bg-gradient-to-r from-night-bordeaux to-berry-crush rounded-[3.5rem] p-12 md:p-20 overflow-hidden border border-white/10 shadow-premium"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-6 leading-tight">
                                Ready for your<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-soft-apricot to-blush-rose">Beauty Regimen?</span>
                            </h2>
                            <p className="text-white/80 text-lg mb-8 leading-relaxed font-medium">
                                Connect with our beauty curators for a personalized consultation and a regimen
                                meticulously designed for your unique essence.
                            </p>
                            <button className="px-12 py-5 bg-white text-night-bordeaux font-black rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all uppercase tracking-[0.2em] text-xs">
                                Schedule Consultation
                            </button>
                        </div>
                        <div className="hidden lg:flex items-center justify-center p-4 md:p-12 scale-90 md:scale-100">
                            <BookingProcessFlow />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Services;
