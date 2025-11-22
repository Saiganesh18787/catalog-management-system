import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveAccessLog } from '../utils/db';

const AuthContext = createContext(null);

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async (reason = 'User logged out') => {
        if (user) {
            await saveAccessLog({
                type: 'LOGOUT',
                user: user.username,
                timestamp: new Date().toISOString(),
                details: reason
            });
        }
        setUser(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('lastActivity');
    }, [user]);

    // Session timeout logic
    useEffect(() => {
        let timeoutId;

        const resetTimer = () => {
            if (user) {
                localStorage.setItem('lastActivity', Date.now().toString());
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    logout('Session expired due to inactivity');
                }, SESSION_TIMEOUT);
            }
        };

        const handleActivity = () => {
            resetTimer();
        };

        if (user) {
            // Check if session is already expired on load/login
            const lastActivity = localStorage.getItem('lastActivity');
            if (lastActivity) {
                const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
                if (timeSinceLastActivity > SESSION_TIMEOUT) {
                    logout('Session expired while away');
                    return;
                }
            }

            // Set initial timer
            resetTimer();

            // Add event listeners
            window.addEventListener('mousemove', handleActivity);
            window.addEventListener('keydown', handleActivity);
            window.addEventListener('click', handleActivity);
            window.addEventListener('scroll', handleActivity);
        }

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('scroll', handleActivity);
        };
    }, [user, logout]);

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
            localStorage.setItem('lastActivity', Date.now().toString());

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
