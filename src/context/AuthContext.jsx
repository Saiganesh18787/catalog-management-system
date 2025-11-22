import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveAccessLog } from '../utils/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for persisted user session
        const checkAuth = async () => {
            try {
                const storedUser = localStorage.getItem('currentUser');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        // Mock authentication
        if (username === 'admin' && password === 'admin123') {
            const userData = { username, role: 'admin' };
            setUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));

            // Log the access
            await saveAccessLog({
                type: 'LOGIN',
                user: username,
                timestamp: new Date().toISOString(),
                details: 'Successful login'
            });

            return true;
        }
        return false;
    };

    const logout = async () => {
        if (user) {
            await saveAccessLog({
                type: 'LOGOUT',
                user: user.username,
                timestamp: new Date().toISOString(),
                details: 'User logged out'
            });
        }
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const logAccess = async (action) => {
        if (user) {
            await saveAccessLog({
                type: 'ACCESS',
                user: user.username,
                timestamp: new Date().toISOString(),
                details: action
            });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, logAccess }}>
            {!loading && children}
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
