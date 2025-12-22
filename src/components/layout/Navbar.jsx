import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const cartCount = 0;
    const appointmentCount = 0;

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <Link to="/" className="navbar-logo">
                    Beauty<span>Verse</span>
                </Link>

                <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
                    <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
                </button>

                <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    <li>
                        <NavLink to="/" onClick={() => setIsOpen(false)} end>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/products" onClick={() => setIsOpen(false)}>Products</NavLink>
                    </li>
                    <li>
                        <NavLink to="/services" onClick={() => setIsOpen(false)}>Services</NavLink>
                    </li>
                    <li>
                        <NavLink to="/professionals" onClick={() => setIsOpen(false)}>Professionals</NavLink>
                    </li>

                    <li className="navbar-icons">
                        <Link to="/appointments" className="nav-icon-link" aria-label="Appointments" onClick={() => setIsOpen(false)}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            {appointmentCount > 0 && <span className="icon-badge">{appointmentCount}</span>}
                        </Link>

                        <Link to="/cart" className="nav-icon-link" aria-label="Cart" onClick={() => setIsOpen(false)}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {cartCount >= 0 && <span className="icon-badge">{cartCount}</span>}
                        </Link>
                    </li>

                    <li className="navbar-auth">
                        {user ? (
                            <div className="user-menu">
                                <NavLink to="/dashboard" className="nav-profile-link" onClick={() => setIsOpen(false)}>Dashboard</NavLink>
                                <button onClick={() => { logout(); setIsOpen(false); }} className="btn-logout">Logout</button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn-login" onClick={() => setIsOpen(false)}>Login</Link>
                                <Link to="/register" className="btn-register" onClick={() => setIsOpen(false)}>Join</Link>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
