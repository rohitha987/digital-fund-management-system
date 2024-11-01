// src/components/EditProfile.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userEmail: user?.userEmail || '',
        userMobileNum: user?.userMobileNum || '',
        userAddress: user?.userAddress || ''
    });
    const [error, setError] = useState<string | null>(null);

    if (!user) {
        return <div>No user data found.</div>;
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:3000/api/users/editprofile/${user?.userEmail}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    withCredentials: true,
                }
            );

            console.log('Profile updated successfully:', response.data);

            // Update the user context with new profile data
            setUser(response.data);

            // Navigate back to the Profile page
            navigate('/profile');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="userMobileNum">
                            Mobile Number
                        </label>
                        <input
                            type="text"
                            name="userMobileNum"
                            id="userMobileNum"
                            value={formData.userMobileNum}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2" htmlFor="userAddress">
                            Address
                        </label>
                        <input
                            type="text"
                            name="userAddress"
                            id="userAddress"
                            value={formData.userAddress}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
