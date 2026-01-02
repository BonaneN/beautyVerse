import React from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { Link } from 'react-router-dom';

const Appointments = () => {
    const { bookings, loading, cancelBooking } = useBooking();

    return (
        <div className="min-h-screen bg-[#FCF8F4] pt-32 pb-20 px-4">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <span className="inline-block px-4 py-1.5 bg-soft-apricot/30 border border-soft-apricot rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-blush-rose mb-6">
                        Your Schedule
                    </span>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-night-bordeaux">
                        Booked Appointments
                    </h1>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cotton-candy border-t-blush-rose"></div>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="grid gap-6">
                        {bookings.map((booking, index) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-none">
                                        <img
                                            src={booking.artistImage || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200'}
                                            alt={booking.artistName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-heading font-black text-night-bordeaux">{booking.artistName}</h3>
                                        <p className="text-gray-400 text-sm font-medium">{booking.service || 'Professional Service'}</p>
                                        <div className="flex gap-4 mt-3">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-blush-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-night-bordeaux">{booking.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-blush-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-night-bordeaux">{booking.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${booking.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-soft-apricot/30 text-blush-rose'
                                        }`}>
                                        {booking.status || 'Upcoming'}
                                    </span>
                                    <button
                                        onClick={() => cancelBooking(booking.id)}
                                        className="p-3 text-gray-300 hover:text-berry-crush transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3.5rem] shadow-premium border border-dashed border-soft-apricot/40">
                        <h3 className="text-2xl font-black text-night-bordeaux mb-4">No appointments found</h3>
                        <p className="text-gray-400 font-medium mb-10">Discover our professionals and book your first session.</p>
                        <Link
                            to="/professionals"
                            className="inline-block px-10 py-4 bg-gradient-to-r from-blush-rose to-berry-crush text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
                        >
                            Explore Professionals
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments;
