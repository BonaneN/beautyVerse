import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useBooking } from '../../context/BookingContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const { upcomingCount } = useBooking();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const activeLinkClass = ({ isActive }) =>
        `relative text-sm font-medium transition-colors duration-300 ${isActive ? 'text-blush-rose' : 'text-night-bordeaux hover:text-blush-rose'}`;

    return (
        <nav className="sticky top-0 z-[1000] h-20 bg-white shadow-soft">
            <div className="h-full px-4 md:px-8 flex items-center justify-between">
                {/* Logo  */}
                <div className="flex-none">
                    <Link to="/" className="font-heading text-2xl md:text-3xl font-bold text-night-bordeaux whitespace-nowrap">
                        Beauty<span className="text-blush-rose">Verse</span>
                    </Link>
                </div>

                {/* Navigation links and icons */}
                <div className="hidden lg:flex flex-1 justify-center items-center gap-12">
                    <ul className="flex items-center gap-8">
                        <li><NavLink to="/" end className={activeLinkClass}>Home</NavLink></li>
                        <li><NavLink to="/products" className={activeLinkClass}>Products</NavLink></li>
                        <li><NavLink to="/services" className={activeLinkClass}>Services</NavLink></li>
                        <li><NavLink to="/professionals" className={activeLinkClass}>Professionals</NavLink></li>
                    </ul>

                    <div className="flex items-center gap-5 pl-10 border-l border-soft-apricot">
                        <Link to="/appointments" className="relative text-night-bordeaux hover:text-blush-rose transition-colors" aria-label="Appointments">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            {upcomingCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-blush-rose text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white px-1">
                                    {upcomingCount}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="relative text-night-bordeaux hover:text-blush-rose transition-colors" aria-label="Cart">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-blush-rose text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white px-1">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Authantication buttons */}
                <div className="hidden lg:flex flex-none w-1/4 justify-end">
                    {user ? (
                        <div className="flex items-center gap-6">
                            {user.isAdmin && (
                                <NavLink to="/admin" className="text-sm font-bold text-blush-rose hover:text-berry-crush transition-colors">Admin</NavLink>
                            )}
                            <NavLink to="/dashboard" className="text-sm font-medium text-night-bordeaux hover:text-blush-rose transition-colors">Dashboard</NavLink>
                            <button
                                onClick={() => logout()}
                                className="text-sm font-medium text-berry-crush hover:text-blush-rose transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-8">
                            <Link to="/login" className="text-night-bordeaux font-semibold hover:text-blush-rose transition-colors">Login</Link>
                            <Link to="/register" className="inline-block px-6 py-2.5 bg-cotton-candy rounded-xl text-night-bordeaux font-semibold hover:bg-blush-rose hover:text-white transition-all shadow-md active:scale-95">Join</Link>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
