// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    userId: string;
    userEmail: string;
    userRole: string;
    userMobileNum: string;
    userAddress: string;
    groupIds: string[]
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

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Assuming the token can help fetch the user info
            const userEmail = localStorage.getItem('userEmail'); // Store userEmail when logging in
            if (userEmail) {
                const fetchUser = async () => {
                    try {
                        const response = await axios.get(`http://localhost:3000/api/users/email/${userEmail}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        setUser(response.data);
                    } catch (error) {
                        console.error('Failed to fetch user:', error);
                        logout();
                    }
                };
                fetchUser();
            }
        }
    }, []);

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
                localStorage.setItem('userEmail', email);
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
        localStorage.removeItem('userEmail');
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
