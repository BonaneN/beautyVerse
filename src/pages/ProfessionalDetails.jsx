import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProfessionalDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchArtistDetails = async () => {
            try {
                setLoading(true);
                // Assuming endpoint matches the pattern /artists/{id}/artist-details/
                const data = await api.get(`/artists/${id}/artist-details/`);
                setArtist(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch artist details');
            } finally {
                setLoading(false);
            }
        };
        fetchArtistDetails();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to remove this professional?')) return;

        try {
            setDeleteLoading(true);
            // Assuming delete endpoint: /artists/{id}/delete-artist/
            await api.delete(`/artists/${id}/delete-artist/`);
            navigate('/professionals');
        } catch (err) {
            alert(err.message || 'Failed to remove artist');
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-cotton-candy border-t-blush-rose"></div>
            </div>
        );
    }

    if (error || !artist) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-soft-apricot/10">
                <div className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-md mx-6">
                    <h2 className="text-2xl font-bold text-night-bordeaux mb-4">Professional Not Found</h2>
                    <p className="text-gray-600 mb-8">{error || 'This professional profile might have been deactivated.'}</p>
                    <Link to="/professionals" className="px-8 py-3 bg-blush-rose text-white rounded-full font-bold hover:shadow-lg transition-all">
                        Back to Directory
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-body">
            {/* Hero Profile Header */}
            <div className="relative h-[400px] bg-night-bordeaux overflow-hidden">
                <img
                    src={artist.profile_picture || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'}
                    alt={artist.name}
                    className="w-full h-full object-cover opacity-50 blur-sm scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
            </div>

            <div className="container-custom -mt-40 relative z-10 pb-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Panel: Profile Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1 space-y-8"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
                            <div className="relative inline-block mb-6">
                                <img
                                    src={artist.profile_picture || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'}
                                    alt={artist.name}
                                    className="w-40 h-40 rounded-full object-cover border-8 border-white shadow-xl"
                                />
                                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                            </div>
                            <h1 className="text-3xl font-heading font-bold text-night-bordeaux mb-2">{artist.name}</h1>
                            <p className="text-blush-rose font-bold uppercase tracking-wider text-sm mb-6">{artist.brand_name || 'Individual Artist'}</p>

                            <div className="flex justify-center gap-4 border-t border-gray-100 pt-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-night-bordeaux">4.9</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Rating</p>
                                </div>
                                <div className="w-px h-10 bg-gray-100"></div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-night-bordeaux">120+</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Clients</p>
                                </div>
                                <div className="w-px h-10 bg-gray-100"></div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-night-bordeaux">5y</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Exp</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact & Location */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                            <h3 className="text-lg font-bold text-night-bordeaux mb-4">Availability</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <svg className="w-5 h-5 text-blush-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {artist.location || 'Kigali, Rwanda'}
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <svg className="w-5 h-5 text-blush-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Mon - Sat (9AM - 7PM)
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Panel: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                            <h2 className="text-2xl font-bold text-night-bordeaux mb-6 border-b-2 border-soft-apricot pb-2 inline-block">Professional Bio</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8 italic">
                                "{artist.bio || `I am a dedicated beauty professional with a passion for excellence. My goal is to enhance your natural beauty and provide an unforgettable salon experience. I specialize in bridal makeup and high-end hair styling.`}"
                            </p>

                            <h2 className="text-2xl font-bold text-night-bordeaux mb-6 border-b-2 border-soft-apricot pb-2 inline-block">Specialties & Expertise</h2>
                            <div className="flex flex-wrap gap-3">
                                {(artist.specialties || ['Makeup', 'Hair Styling', 'Skincare', 'Nail Art']).map(tag => (
                                    <span key={tag} className="px-6 py-2 bg-cotton-candy/20 text-berry-crush font-bold rounded-xl border border-cotton-candy/40">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Booking Action */}
                        <div className="flex gap-4">
                            <button className="flex-1 py-5 bg-gradient-to-r from-blush-rose to-berry-crush text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all">
                                Book Appointment
                            </button>

                            {user && user.isAdmin && (
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="px-8 py-5 border-2 border-berry-crush text-berry-crush rounded-2xl font-bold hover:bg-berry-crush hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {deleteLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    )}
                                    Admin: Remove Artist
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalDetails;
