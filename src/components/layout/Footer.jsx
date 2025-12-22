import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container container">
                <div className="footer-grid">

                    <div className="footer-col branding">
                        <Link to="/" className="footer-logo">
                            Beauty<span>Verse</span>
                        </Link>
                        <p className="footer-tagline">
                            Connecting you with the world's finest beauty products and expert professionals.
                        </p>
                        <div className="social-links">
                            <a href="#" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                            <a href="#" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                            <a href="#" aria-label="Twitter">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                            </a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/services">Services</Link></li>
                            <li><Link to="/professionals">Professionals</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Support</h3>
                        <ul>
                            <li><Link to="/faq">FAQs</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/shipping">Shipping Info</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Newsletter</h3>
                        <p>Subscribe to get the latest beauty updates and offers.</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Your email" aria-label="Email address" required />
                            <button type="submit">Join</button>
                        </form>
                    </div>

                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} BeautyVerse. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
