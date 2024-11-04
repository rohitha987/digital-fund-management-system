// src/components/GroupDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Participant {
    userId: string;
    userName: string; // Add other fields as necessary
}

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
    participants: string[]; // Array of userIds
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Transaction {
    transactionId: string;
    transactionAmount: number;
    transactionDate: string;
    transactionType: string;
    userId: string;
}

const GroupDetails: React.FC = () => {
    const {user} = useAuth();
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [requests,setRequests] = useState<Participant[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setGroup(response.data);

                // Fetch participants details
                const participantsData = await Promise.all(
                    response.data.participants.map(async (userId: string) => {
                        const participantResponse = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                            },
                        });
                        return participantResponse.data;
                    })
                );
                setParticipants(participantsData);

                // Fetch requests details
                const requestsData = await Promise.all(
                    response.data.joinRequests.map(async (userId: string) => {
                        const requestResponse = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                            },
                        });
                        return requestResponse.data;
                    })
                );
                console.log(requestsData);
                setRequests(requestsData);
            } catch (err) {
                console.error('Error fetching group details:', err);
                setError('Failed to fetch group details.');
            } finally {
                setLoading(false);
            }
        };

        fetchGroupDetails();
    }, [groupId]);

    const handleViewTransactions = (userId: string) => {
        navigate(`/transactions/${userId}`); // Redirect to the participant's transactions page
    };

    const handleViewAllGroupTransactions = () => {
        navigate(`/groups/${groupId}/transactions`); // Redirect to the GroupTransactions page
    };

    const handleViewPlan = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/groups/${groupId}/plan`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            // Handle the plan data as needed
            console.log('Group Plan:', response.data);
            // Navigate or display the plan in a modal, etc.
        } catch (err) {
            console.error('Error fetching group plan:', err);
            setError('Failed to fetch group plan.');
        }
    };

    const handleAccept = async (userId: string) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/users/${groupId}/join-request/${userId}`,{
                "action":"accept"
            },{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            if(response.status===200)
                console.log(`Accepted ${userId}`);
            // Optionally refresh participants or handle UI changes
        } catch (err) {
            console.error('Error accepting participant:', err);
        }
    };

    const handleReject = async (userId: string) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/users/${groupId}/join-request/${userId}`,{
                "action":"reject"
            },{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            if(response.status===200)
            console.log(`Rejected ${userId}`);
            // Optionally refresh participants or handle UI changes
        } catch (err) {
            console.error('Error rejecting participant:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-200 to-blue-200 py-10 px-4">
            <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
                {group ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-semibold text-center text-blue-700">{group.groupName}</h2>
                            {user?.userRole === 'organizer' && (
                            <div className="relative">
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                                    onClick={() => setDropdownVisible(!dropdownVisible)}
                                >
                                    Requests
                                </button>
                                {dropdownVisible && (
                                    <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg z-10">
                                        <ul className="max-h-60 overflow-y-auto">
                                            {requests.map(participant => (
                                                <li key={participant.userId} className="flex justify-between items-center p-2 hover:bg-gray-100">
                                                    <span>{participant.userName}</span>
                                                    <div className="flex space-x-1">
                                                        <button
                                                            className="bg-green-500 text-white py-1 px-2 rounded-md mr-1"
                                                            onClick={() => handleAccept(participant.userId)}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            className="bg-red-500 text-white py-1 px-2 rounded-md"
                                                            onClick={() => handleReject(participant.userId)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            )}
                    </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-700">
                            <p><span className="font-semibold">Type:</span> {group.groupType}</p>
                            <p><span className="font-semibold">Interest:</span> {group.interest}%</p>
                            <p><span className="font-semibold">Members:</span> {group.members}</p>
                            <p><span className="font-semibold">Duration:</span> {group.duration} months</p>
                            <p><span className="font-semibold">Total Amount:</span> ${group.totalAmount}</p>
                            <p><span className="font-semibold">Ticket Value:</span> ${group.ticketValue}</p>
                        </div>
                        <p className="text-gray-600 mb-6">{group.description}</p>

                        <h3 className="text-xl font-semibold mt-6 mb-4">Participants:</h3>
                        <ul className="space-y-2 mb-6">
                            {participants.map(participant => (
                                <li key={participant.userId} className="flex items-center justify-between text-gray-700">
                                    {participant.userName}
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() => handleViewTransactions(participant.userId)}
                                    >
                                        View Transactions
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <button
                            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition mb-6"
                            onClick={handleViewPlan}
                        >
                            View Plan
                        </button>

                        <button
                        className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition mb-6"
                        onClick={() => navigate(`/groups/${groupId}/installments`)}
                    >
                        My Installments
                    </button>


                        <button
                            className="w-full bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-500 transition mb-6"
                            onClick={handleViewAllGroupTransactions}
                        >
                            View All Group Transactions
                        </button>

                        {transactions.length > 0 && (
                            <div>
                                <h4 className="text-xl font-semibold mt-4 mb-2">All Group Transactions</h4>
                                <ul className="space-y-2">
                                    {transactions.map((transaction) => (
                                        <li key={transaction.transactionId} className="flex justify-between bg-gray-100 p-3 rounded-md">
                                            <span>{transaction.transactionDate}</span>
                                            <span>${transaction.transactionAmount}</span>
                                            <span>{transaction.transactionType}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center">No group data available.</div>
                )}
            </div>
        </div>
    );
};

export default GroupDetails;
