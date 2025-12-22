import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const cartCount = 0;
    const appointmentCount = 0;

    const toggleMenu = () => setIsOpen(!isOpen);

    const activeLinkClass = ({ isActive }) =>
        `relative text-sm font-medium transition-colors duration-300 ${isActive ? 'text-blush-rose' : 'text-night-bordeaux hover:text-blush-rose'}`;

    return (
        <nav className="sticky top-0 z-[1000] h-20 bg-white flex items-center shadow-soft">
            <div className="container-custom w-full flex items-center justify-between">

                <div className="flex-none">
                    <Link to="/" className="font-heading text-3xl font-bold text-night-bordeaux">
                        Beauty<span className="text-blush-rose">Verse</span>
                    </Link>
                </div>

                <button
                    className="lg:hidden relative w-6 h-5 flex flex-col justify-between"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <span className={`w-full h-0.5 bg-night-bordeaux transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-full h-0.5 bg-night-bordeaux transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-full h-0.5 bg-night-bordeaux transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                </button>

                <div className={`
                    fixed lg:static top-0 ${isOpen ? 'left-0' : '-left-full'} 
                    flex flex-col lg:flex-row items-start lg:items-center justify-start lg:justify-between 
                    flex-1 w-4/5 max-w-[300px] lg:max-w-none h-screen lg:h-auto 
                    bg-white lg:bg-transparent shadow-2xl lg:shadow-none 
                    transition-all duration-400 z-[999] lg:z-auto
                    pt-24 lg:pt-0 px-8 lg:px-0
                `}>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center lg:gap-12 lg:mx-auto mb-8 lg:mb-0 w-full lg:w-auto">
                        <ul className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8 mb-8 lg:mb-0">
                            <li><NavLink to="/" onClick={() => setIsOpen(false)} end className={activeLinkClass}>Home</NavLink></li>
                            <li><NavLink to="/products" onClick={() => setIsOpen(false)} className={activeLinkClass}>Products</NavLink></li>
                            <li><NavLink to="/services" onClick={() => setIsOpen(false)} className={activeLinkClass}>Services</NavLink></li>
                            <li><NavLink to="/professionals" onClick={() => setIsOpen(false)} className={activeLinkClass}>Professionals</NavLink></li>
                        </ul>

                        <div className="flex items-center gap-6 pt-6 lg:pt-0 border-t lg:border-0 border-soft-apricot w-full lg:w-auto">
                            <Link to="/appointments" className="relative text-night-bordeaux hover:text-blush-rose transition-colors" aria-label="Appointments" onClick={() => setIsOpen(false)}>
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                {appointmentCount >= 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-blush-rose text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white px-1">
                                        {appointmentCount}
                                    </span>
                                )}
                            </Link>

                            <Link to="/cart" className="relative text-night-bordeaux hover:text-blush-rose transition-colors" aria-label="Cart" onClick={() => setIsOpen(false)}>
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                {cartCount >= 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-blush-rose text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white px-1">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    <div className="flex-none w-full lg:w-auto pt-8 lg:pt-0 border-t lg:border-0 border-soft-apricot">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <NavLink to="/dashboard" className="text-sm font-medium text-night-bordeaux hover:text-blush-rose transition-colors" onClick={() => setIsOpen(false)}>Dashboard</NavLink>
                                <button
                                    onClick={() => { logout(); setIsOpen(false); }}
                                    className="text-sm font-medium text-berry-crush hover:text-blush-rose transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
                                <Link to="/login" className="text-night-bordeaux font-semibold hover:text-blush-rose transition-colors" onClick={() => setIsOpen(false)}>Login</Link>
                                <Link to="/register" className="w-full lg:w-auto inline-block text-center px-6 py-2.5 bg-cotton-candy rounded-xl text-night-bordeaux font-semibold hover:bg-blush-rose hover:text-white transition-all shadow-md active:scale-95" onClick={() => setIsOpen(false)}>Join</Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
