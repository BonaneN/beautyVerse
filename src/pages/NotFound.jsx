import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
            <h1>404</h1>
            <p>Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>Return Home</Link>
        </div>
    );
};

export default NotFound;
