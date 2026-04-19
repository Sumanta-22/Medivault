import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token on load
        const token = localStorage.getItem('medivault_token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const res = await fetch('/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                localStorage.removeItem('medivault_token');
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = (token, userData) => {
        localStorage.setItem('medivault_token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('medivault_token');
        setUser(null);
    };

    // Helper to get token for API calls
    const getToken = () => localStorage.getItem('medivault_token');

    // Compatibility mapper for existing Next Auth syntax `session?.user`
    const session = user ? { user } : null;

    return (
        <AuthContext.Provider value={{ user, session, loading, login, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
