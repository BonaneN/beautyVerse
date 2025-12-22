import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

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
