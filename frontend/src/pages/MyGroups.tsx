// src/components/MyGroups.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Group {
    groupId: string;
    groupName: string;
    groupType: string;
    interest: number;
    organizerId: string;
    members: number;
    duration: number;
    totalAmount: number;
    ticketValue: number;
    participants: string[];
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const MyGroups: React.FC = () => {
    const { user } = useAuth(); // Access user data from context
    const [groups, setGroups] = useState<Group[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchGroups = async () => {
            if (user && user.groupIds.length > 0) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/users/groups/${user?.userEmail}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    });
                    const userGroups = response.data.filter((group: Group) =>
                        user.groupIds.includes(group.groupId)
                    );
                    setGroups(userGroups);
                } catch (err) {
                    console.error('Error fetching groups:', err);
                    setError('Failed to fetch groups.');
                }
            }
        };

        fetchGroups();
    }, [user]);

    const handleViewDetails = (groupId: string) => {
        navigate(`/groups/${groupId}`); // Redirect to the group details page
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-200 to-blue-200">
            <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">My Groups</h2>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.length > 0 ? (
                        groups.map(group => (
                            <div key={group.groupId} className="flex flex-col p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-gray-50">
                                <h3 className="text-xl font-semibold text-gray-800">{group.groupName}</h3>
                                <p className="text-gray-600">Type: <span className="font-medium">{group.groupType}</span></p>
                                <p className="text-gray-600">Interest: <span className="font-medium">{group.interest}%</span></p>
                                <p className="text-gray-600">Members: <span className="font-medium">{group.members}</span></p>
                                <p className="text-gray-600">Duration: <span className="font-medium">{group.duration} months</span></p>
                                <p className="text-gray-600">Total Amount: <span className="font-bold">${group.totalAmount}</span></p>
                                <p className="text-gray-600">Ticket Value: <span className="font-bold">${group.ticketValue}</span></p>
                                <p className="text-gray-600 mb-4 flex-grow">{group.description}</p>
                                <div className="mt-4">
                                    <button 
                                        className="w-full h-12 bg-red-700 text-white rounded-lg hover:bg-red-500 transition-colors duration-200"
                                        onClick={() => handleViewDetails(group.groupId)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-center">No groups found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyGroups;
