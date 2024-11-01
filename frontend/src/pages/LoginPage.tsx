// src/components/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({ userEmail: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth(); // Get the login function from context

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData.userEmail, formData.password); // Call login from context
            navigate('/profile'); // Navigate to profile after successful login
        } catch (err) {
            setError('Login failed. Please check your credentials.'); // Handle error here
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="userEmail">Email</label>
                        <input type="email" name="userEmail" id="userEmail" value={formData.userEmail} onChange={handleChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
