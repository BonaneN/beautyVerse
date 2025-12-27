import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import AddProfessionalForm from '../components/professionals/AddProfessionalForm';

const Professionals = () => {
    const { user } = useAuth();
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchArtists = async () => {
        try {
            setLoading(true);
            const data = await api.get('/artists/list-artists/');
            setArtists(data || []);
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
        <div className="min-h-screen bg-gradient-to-b from-white to-soft-apricot/10 py-20">
            <div className="container-custom">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-5xl font-heading font-bold text-night-bordeaux mb-4">Our Professionals</h1>
                        <p className="text-lg text-gray-600">Meet the first class service providers</p>
                    </div>

                    <div className="flex gap-4">
                        {user && user.isAdmin && (
                            <Link
                                to="/admin"
                                className="px-6 py-3 bg-white border-2 border-blush-rose text-blush-rose rounded-full font-bold hover:bg-blush-rose hover:text-white transition-all shadow-lg"
                            >
                                Manage Specialties
                            </Link>
                        )}
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="px-8 py-3 bg-gradient-to-r from-blush-rose to-berry-crush text-white rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all text-center"
                        >
                            {showAddForm ? 'View Directory' : 'Become an Artist'}
                        </button>
                    </div>
                </div>

                {/* Add Artist Form */}
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16"
                    >
                        <AddProfessionalForm onArtistAdded={handleArtistAdded} />
                    </motion.div>
                )}

                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cotton-candy border-t-blush-rose"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-berry-crush/10 border border-berry-crush text-berry-crush rounded-xl p-8 text-center max-w-xl mx-auto">
                        <p className="font-bold">{error}</p>
                        <button onClick={fetchArtists} className="mt-4 text-sm font-bold underline">Try Again</button>
                    </div>
                )}

                {!loading && !error && artists.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 mb-6">No professionals have joined yet. Be the first!</p>
                        <Link to="/register-artist" className="text-blush-rose font-bold hover:underline">Register Now →</Link>
                    </div>
                )}

                {!loading && !error && artists.length > 0 && (
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {artists.map((artist, index) => (
                            <motion.div
                                key={artist.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all group"
                            >
                                <Link to={`/professionals/${artist.id}`}>
                                    <div className="aspect-[4/5] relative overflow-hidden">
                                        <img
                                            src={artist.profile_picture || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'}
                                            alt={artist.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-night-bordeaux/80 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-white font-bold text-xl">{artist.name}</h3>
                                            <p className="text-soft-apricot text-sm">{artist.brand_name || 'Glow Studio'}</p>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                                            {(artist.specialties || ['Makeup', 'Hair']).map(tag => (
                                                <span key={tag} className="px-2 py-0.5 bg-cotton-candy/20 text-berry-crush text-xs font-bold rounded-md whitespace-nowrap">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Professionals;

