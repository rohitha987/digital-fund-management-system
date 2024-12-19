// src/components/Profile.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from 'react-icons/fa';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    if (!user) {
        return <div className="text-center text-lg font-semibold text-gray-600">No user data found.</div>;
    }

    const handleEditProfile = () => {
        try {
            navigate('/editProfile');
        } catch (err) {
            console.error('Error navigating to edit profile:', err);
            setError('Failed to navigate to edit profile.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                {/* <div className="flex items-center justify-center mb-6">
                    <img
                        src="/path/to/profile-picture.png" // Replace with actual profile image path or user image
                        alt="Profile"
                        className="w-24 h-24 rounded-full shadow-md"
                    />
                </div> */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Your Profile</h2>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                <div className="space-y-4 text-gray-700">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">Email:</span>
                        <span>{user.userEmail}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">Role:</span>
                        <span className="capitalize">{user.userRole}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">Mobile Number:</span>
                        <span>{user.userMobileNum}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">Address:</span>
                        <span>{user.userAddress}</span>
                    </div>
                </div>

                <button
                    onClick={handleEditProfile}
                    className="flex items-center justify-center mt-8 w-full bg-indigo-800 text-white p-3 rounded-lg shadow-md hover:bg-indigo-400 transition-colors duration-200"
                >
                    <FaUserEdit className="mr-2" />
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;
