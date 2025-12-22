import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in?
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setUser({ loggedIn: true });
        }
        setLoading(false);
    }, []);


// Login user and save tokens to localStorage
    const login = async (username, password) => {
        try {
            const data = await api.post('/beautyVerse/users/login-user/', { username, password });

            if (data.access) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                setUser({ loggedIn: true, ...data.user });
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
            await api.post('/beautyVerse/users/create-account/', userData);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };


// Clear tokens and reset state
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
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
