import React from 'react';
import { motion } from 'framer-motion';

const services = [
    { title: 'Hair Styling', icon: '💇‍♀️', desc: 'Expert cuts, coloring, and styling for every hair type.' },
    { title: 'Makeup Artistry', icon: '💄', desc: 'Flawless makeup for weddings, events, and photoshoots.' },
    { title: 'Skincare', icon: '🧖‍♀️', desc: 'Rejuvenating facials and clinical skincare treatments.' },
    { title: 'Nail Care', icon: '💅', desc: 'Luxury manicures and pedicures with a creative touch.' }
];

const Services = () => {
    return (
        <div className="min-h-screen bg-soft-apricot/10 py-20 font-body">
            <div className="container-custom">
                <header className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-heading font-bold text-night-bordeaux mb-6"
                    >
                        Our Exquisite Services
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Elevate your natural beauty with our curated range of professional services, delivered by the industry's finest artists.
                    </motion.p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 text-center"
                        >
                            <div className="text-6xl mb-6">{service.icon}</div>
                            <h3 className="text-2xl font-bold text-night-bordeaux mb-4">{service.title}</h3>
                            <p className="text-gray-600 mb-8">{service.desc}</p>
                            <button className="w-full py-4 bg-cotton-candy/30 text-blush-rose font-bold rounded-xl hover:bg-blush-rose hover:text-white transition-all">
                                Explore
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Highlights Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="mt-20 bg-gradient-to-r from-night-bordeaux to-berry-crush rounded-[3rem] p-16 text-white flex flex-col lg:flex-row items-center justify-between gap-12"
                >
                    <div className="max-w-xl text-center lg:text-left">
                        <h2 className="text-4xl font-heading font-bold mb-6">Want a tailored experience?</h2>
                        <p className="text-white/80 text-lg mb-8">Connect with our specialists for a personalized consultation and a beauty regimen designed just for you.</p>
                        <button className="px-10 py-5 bg-white text-night-bordeaux font-black rounded-2xl shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-sm">
                            Book Consultant
                        </button>
                    </div>
                    <div className="w-full lg:w-1/3 aspect-square bg-white/10 rounded-3xl backdrop-blur-xl flex items-center justify-center">
                        <svg className="w-32 h-32 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Services;

