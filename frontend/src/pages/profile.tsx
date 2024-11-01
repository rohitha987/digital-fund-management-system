// src/components/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    if (!user) {
        return <div>No user data found.</div>;
    }

    const handleEditProfile = () => {
        try {
            // Navigate to edit profile page
            navigate('/editProfile');
        } catch (err) {
            console.error('Error navigating to edit profile:', err);
            setError('Failed to navigate to edit profile.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="mb-4">
                    <strong>Email:</strong> {user.userEmail}
                </div>
                <div className="mb-4">
                    <strong>Role:</strong> {user.userRole}
                </div>
                <div className="mb-4">
                    <strong>Mobile Number:</strong> {user.userMobileNum}
                </div>
                <div className="mb-4">
                    <strong>Address:</strong> {user.userAddress}
                </div>
                <button
                    onClick={handleEditProfile}
                    className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;
