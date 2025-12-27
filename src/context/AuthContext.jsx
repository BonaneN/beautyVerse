import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in?
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const username = localStorage.getItem('username');
        if (token) {
            setUser({
                loggedIn: true,
                username: username,
                isAdmin: username === 'admin'
            });
        }
        setLoading(false);

        const handleAuthError = () => {
            logout();
        };
        window.addEventListener('auth-401', handleAuthError);
        return () => window.removeEventListener('auth-401', handleAuthError);
    }, []);


    // Login user and save tokens to localStorage
    const login = async (username, password) => {
        try {
            const data = await api.post('/users/login-user/', { username, password });

            if (data.access) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('username', username);

                const isAdmin = username === 'admin';
                setUser({ loggedIn: true, username, isAdmin });
                return { success: true };
            }
            throw new Error('Invalid login response');
        } catch (error) {
            return { success: false, message: error.message };
        }
    };


    // Register a new account
    const register = async (userData) => {
        try {
            await api.post('/users/create-account/', userData);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };


    // Clear tokens and reset state
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
