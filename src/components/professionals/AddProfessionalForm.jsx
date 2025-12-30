import React, { useState } from 'react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const AddProfessionalForm = ({ onArtistAdded }) => {
    // Categories matching Django Model choices
    const categories = [
        "Makeup", "Hair", "Nails", "Spa & Massage",
        "Skincare", "Henna", "Barber", "Lashes & Brows"
    ];

    const [formData, setFormData] = useState({
        name: '',
        brand_name: '',
        phone: '',
        whatsapp_contact: '',
        location: '',
        instagram: '',
        tiktok: '',
        bio: '', // Bio is still useful although not in the provided model snippet, keeping it for the profile
        profile_picture: null
    });

    const [specialties, setSpecialties] = useState([]); // Category selection

    // Availability slots management
    const [slots, setSlots] = useState([]); // [{ date: '', time: '' }]
    const [currentSlot, setCurrentSlot] = useState({ date: '', time: '' });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryToggle = (category) => {
        setSpecialties(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const addSlot = () => {
        if (!currentSlot.date || !currentSlot.time) return;
        setSlots(prev => [...prev, { ...currentSlot }]);
        setCurrentSlot({ date: '', time: '' });
    };

    const removeSlot = (index) => {
        setSlots(prev => prev.filter((_, i) => i !== index));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();

            // Basic Info
            formDataToSend.append('name', formData.name);
            if (formData.brand_name) formDataToSend.append('brand_name', formData.brand_name);
            if (formData.phone) formDataToSend.append('phone', formData.phone);
            if (formData.whatsapp_contact) formDataToSend.append('whatsapp_contact', formData.whatsapp_contact);
            formDataToSend.append('location', formData.location);
            if (formData.instagram) formDataToSend.append('instagram', formData.instagram);
            if (formData.tiktok) formDataToSend.append('tiktok', formData.tiktok);
            if (formData.bio) formDataToSend.append('bio', formData.bio);

            // Specialities & Availability
            formDataToSend.append('categories', JSON.stringify(specialties));
            formDataToSend.append('availability_slots', JSON.stringify(slots));

            if (imageFile) {
                formDataToSend.append('profile_picture', imageFile);
            }

            // Use api utility with FormData - need to use request method directly
            const token = localStorage.getItem('access_token');
            const response = await api.request('/artists/register-artist/', {
                method: 'POST',
                headers: {
                    // Don't set Content-Type for FormData - browser will set it with boundary
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: formDataToSend
            });

            setSuccess('Artist profile created successfully!');
            if (onArtistAdded) onArtistAdded(response);

            // Reset form
            setFormData({
                name: '',
                brand_name: '',
                phone: '',
                whatsapp_contact: '',
                location: '',
                instagram: '',
                tiktok: '',
                bio: '',
                profile_picture: null
            });
            setSpecialties([]);
            setSlots([]);
            setImageFile(null);
            setImagePreview('');
        } catch (err) {
            setError(err.message || 'Failed to register artist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            <div>
                <h2 className="text-3xl font-heading font-black text-night-bordeaux mb-2">Join the Visionaries</h2>
                <p className="text-gray-500 font-medium">Align your artistry with our exclusive directory.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* 1. Identity & Contact */}
                <div className="space-y-8">
                    <div className="p-8 bg-soft-apricot/5 rounded-3xl border border-soft-apricot/10">
                        <h3 className="text-[10px] font-black text-blush-rose uppercase tracking-[0.3em] mb-6">1. Identity & Contact</h3>

                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-dashed border-soft-apricot/40 shadow-inner">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-8 h-8 text-soft-apricot/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <label className="cursor-pointer px-6 py-3 bg-white text-night-bordeaux text-xs font-black uppercase tracking-widest rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                                Upload Photo
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Stage Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blush-rose outline-none transition-all font-bold text-sm" placeholder="Bella Glow" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Studio / Brand</label>
                                <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blush-rose outline-none transition-all font-bold text-sm" placeholder="Glow Sanctuary" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blush-rose outline-none transition-all font-bold text-sm" placeholder="+250..." />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">WhatsApp Contact</label>
                                <input type="text" name="whatsapp_contact" value={formData.whatsapp_contact} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blush-rose outline-none transition-all font-bold text-sm" placeholder="+250..." />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sanctuary Location *</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blush-rose outline-none transition-all font-bold text-sm" placeholder="Kigali, Rwanda" />
                        </div>
                    </div>

                    <div className="p-8 bg-soft-apricot/5 rounded-3xl border border-soft-apricot/10">
                        <h3 className="text-[10px] font-black text-blush-rose uppercase tracking-[0.3em] mb-6">Social Influence</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Instagram URL</label>
                                <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blush-rose outline-none transition-all font-bold text-sm" placeholder="https://instagram.com/..." />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">TikTok URL</label>
                                <input type="url" name="tiktok" value={formData.tiktok} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blush-rose outline-none transition-all font-bold text-sm" placeholder="https://tiktok.com/@..." />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Expertise & Availability */}
                <div className="space-y-8">
                    <div className="p-8 bg-soft-apricot/5 rounded-3xl border border-soft-apricot/10">
                        <h3 className="text-[10px] font-black text-blush-rose uppercase tracking-[0.3em] mb-6">2. Expertise & Availability</h3>

                        <div className="mb-8">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Service Categories *</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat} type="button"
                                        onClick={() => handleCategoryToggle(cat)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${specialties.includes(cat)
                                            ? 'bg-night-bordeaux text-white border-night-bordeaux'
                                            : 'bg-white text-gray-400 border-gray-100 hover:border-soft-apricot'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Availability Slots</label>
                            <div className="flex gap-4 mb-6">
                                <div className="flex-1">
                                    <input type="date" value={currentSlot.date} onChange={(e) => setCurrentSlot(s => ({ ...s, date: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 font-bold text-xs" />
                                </div>
                                <div className="flex-1">
                                    <input type="time" value={currentSlot.time} onChange={(e) => setCurrentSlot(s => ({ ...s, time: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 font-bold text-xs" />
                                </div>
                                <button type="button" onClick={addSlot} className="w-12 h-12 bg-night-bordeaux text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {slots.map((slot, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 group">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-night-bordeaux">{slot.date}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase">{slot.time}</p>
                                        </div>
                                        <button type="button" onClick={() => removeSlot(index)} className="opacity-0 group-hover:opacity-100 text-berry-crush transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-soft-apricot/5 rounded-3xl border border-soft-apricot/10">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Short Philosophy</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-100 focus:border-blush-rose outline-none transition-all font-bold text-sm resize-none" placeholder="Share your artistic vision..." />
                    </div>
                </div>
            </div>

            {error && <p className="p-6 bg-berry-crush/5 text-berry-crush text-[10px] font-black uppercase tracking-widest rounded-2xl border border-berry-crush/10 text-center">{error}</p>}
            {success && <p className="p-6 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-green-100 text-center">{success}</p>}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-12 py-5 bg-night-bordeaux text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center gap-4"
                >
                    {loading ? 'Submitting Registry...' : 'Engrave on Directory'}
                    {!loading && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    )}
                </button>
            </div>
        </form>
    );
};

export default AddProfessionalForm;
