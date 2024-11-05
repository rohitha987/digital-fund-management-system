// src/components/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({ userEmail: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false); // Success state
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
            setSuccess(true); // Show success alert
            setError(null); // Clear any previous error

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSuccess(false);
                navigate('/mygroups'); // Navigate to profile after successful login
            }, 1000);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            setSuccess(false); // Hide success alert on failure
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                
                {/* Success Alert */}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">Login successful! Redirecting...</span>
                    </div>
                )}
                
                {/* Error Alert */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="userEmail">Email</label>
                        <input type="email" name="userEmail" id="userEmail" value={formData.userEmail} onChange={handleChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <button type="submit" className="w-full bg-indigo-800 text-white p-2 rounded-md hover:bg-indigo-400">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
