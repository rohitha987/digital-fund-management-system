import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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

const ChitPlans: React.FC = () => {
    const { user } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/groups/all`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setGroups(response.data);
            } catch (err) {
                console.error('Error fetching groups:', err);
                setError('Failed to fetch groups.');
            }
        };

        fetchGroups();
    }, []);

    const handleCalculateChit = async (group: Group) => {
        const { groupId,totalAmount, duration, members, interest } = group;

        try {
            const response = await axios.post('http://localhost:3000/api/groups/calculateChit', {
                totalAmount,
                months: duration,
                members,
                commission: interest, // Assuming 'interest' represents the commission percentage
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            // Navigate to PlanDetails with the results in state
            navigate('/plan', { state: { results: response.data.results, totalProfit: response.data.totalProfit,groupId:groupId } });
        } catch (err) {
            console.error('Error calculating chit:', err);
            setError('Failed to calculate chit.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-200 to-blue-200 py-10 px-4">
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-black-600">All Chit Plans</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.length > 0 ? (
                        groups.map(group => (
                            <div key={group.groupId} className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow duration-200 bg-gray-50 flex flex-col">
                                <h3 className="text-xl font-semibold mb-2 text-black-500">{group.groupName}</h3>
                                <p className="text-gray-700"><strong>Type:</strong> {group.groupType}</p>
                                <p className="text-gray-700"><strong>Interest:</strong> {group.interest}%</p>
                                <p className="text-gray-700"><strong>Members:</strong> {group.members}</p>
                                <p className="text-gray-700"><strong>Duration:</strong> {group.duration} months</p>
                                <p className="text-gray-700"><strong>Total Amount:</strong> ${group.totalAmount}</p>
                                <p className="text-gray-700"><strong>Ticket Value:</strong> ${group.ticketValue}</p>
                                <p className="text-gray-700 mb-4">{group.description}</p>
                                <div className="flex justify-center mt-auto">
                                    <button 
                                        onClick={() => handleCalculateChit(group)} 
                                        className="w-full max-w-xs bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-500 transition"
                                    >
                                        View Plan
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500">No groups found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChitPlans;
