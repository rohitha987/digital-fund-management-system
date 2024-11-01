// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

interface User {
    userEmail: string;
    userRole: string;
    userMobileNum: string;
    userAddress: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean; // New property for authentication state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                userEmail: email,
                password: password,
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                const userResponse = await axios.get(`http://localhost:3000/api/users/email/${email}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${response.data.token}`,
                    },
                });

                setUser(userResponse.data); // Update user state
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Login failed. Please check your credentials.');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken'); // Clear the token
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated: !!user }}>
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
