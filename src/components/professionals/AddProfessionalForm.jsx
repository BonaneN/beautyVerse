import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AddProfessionalForm = ({ onArtistAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        brand_name: '',
        bio: '',
        location: '',
        specialties: '', // Will be comma-separated or selected from list
        profile_picture: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let response;
            const token = localStorage.getItem('access_token');

            // If there's an image file, use FormData
            if (imageFile) {
                const formDataToSend = new FormData();
                formDataToSend.append('name', formData.name);
                formDataToSend.append('brand_name', formData.brand_name);
                formDataToSend.append('bio', formData.bio);
                formDataToSend.append('location', formData.location);
                formDataToSend.append('specialties', formData.specialties);
                formDataToSend.append('profile_picture', imageFile);

                const res = await fetch('https://bonane00.pythonanywhere.com/beautyVerse/artists/register-artist/', {
                    method: 'POST',
                    headers: {
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                    body: formDataToSend
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.detail || errorData.error || 'Failed to register artist');
                }
                response = await res.json();
            } else {
                // Otherwise use JSON
                response = await api.post('/artists/register-artist/', formData);
            }

            setSuccess('Artist registered successfully!');
            setFormData({
                name: '',
                brand_name: '',
                bio: '',
                location: '',
                specialties: '',
                profile_picture: ''
            });
            setImageFile(null);
            setImagePreview('');

            if (onArtistAdded) {
                onArtistAdded(response);
            }
        } catch (err) {
            setError(err.message || 'Failed to register artist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-premium p-10 font-body">
            <h2 className="text-3xl font-heading font-bold text-night-bordeaux mb-8 border-b-2 border-soft-apricot pb-4">
                Register New Professional
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Side: Basic Info */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">FullName / Stage Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blush-rose focus:ring-2 focus:ring-blush-rose/20 outline-none transition-all"
                            placeholder="e.g., Bella Glow"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Studio / Brand Name</label>
                        <input
                            type="text"
                            name="brand_name"
                            value={formData.brand_name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blush-rose focus:ring-2 focus:ring-blush-rose/20 outline-none transition-all"
                            placeholder="e.g., Glow Studio"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blush-rose focus:ring-2 focus:ring-blush-rose/20 outline-none transition-all"
                            placeholder="e.g., Kigali, Rwanda"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Specialties (comma separated) *</label>
                        <input
                            type="text"
                            name="specialties"
                            value={formData.specialties}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blush-rose focus:ring-2 focus:ring-blush-rose/20 outline-none transition-all"
                            placeholder="e.g., Makeup, Hair Styling, Nails"
                        />
                    </div>
                </div>

                {/* Right Side: Media & Bio */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Bio *</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            required
                            rows="4"
                            maxLength="500"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blush-rose focus:ring-2 focus:ring-blush-rose/20 outline-none transition-all resize-none"
                            placeholder="Tell us about your expertise..."
                        />
                        <p className="text-right text-[10px] text-gray-400 mt-1">{formData.bio.length}/500</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture *</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <label className="cursor-pointer px-4 py-2 bg-cotton-candy/30 text-blush-rose text-sm font-bold rounded-lg hover:bg-cotton-candy/50 transition-all">
                                Upload Photo
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {error && <p className="mt-8 p-4 bg-berry-crush/10 text-berry-crush text-sm font-medium rounded-xl border border-berry-crush/20 text-center">{error}</p>}
            {success && <p className="mt-8 p-4 bg-green-50 text-green-600 text-sm font-medium rounded-xl border border-green-200 text-center">{success}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-10 py-5 bg-gradient-to-r from-blush-rose to-berry-crush text-white rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.01] flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {loading ? 'Registering...' : 'Complete Registration'}
                {!loading && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                )}
            </button>
        </form>
    );
};

export default AddProfessionalForm;
