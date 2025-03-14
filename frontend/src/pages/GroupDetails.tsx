import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Participant {
    userId: string;
    userName: string;
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
    participants: string[];
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
    const { user } = useAuth();
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [requests, setRequests] = useState<Participant[]>([]);
    const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
     // Success popup state

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

                // Fetch participants
                const participantsData: Participant[] = await Promise.all(
                    response.data.participants.map(async (userId: string) => {
                        const participantResponse = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                            },
                        });
                        return participantResponse.data as Participant;
                    })
                );
                setParticipants(participantsData);

                // Fetch join requests
                const requestsData: Participant[] = await Promise.all(
                    response.data.joinRequests.map(async (userId: string) => {
                        const requestResponse = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                            },
                        });
                        return requestResponse.data as Participant;
                    })
                );
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
        navigate(`/transactions/${groupId}/${userId}`);
    };

    const handleViewAllGroupTransactions = () => {
        navigate(`/groups/${groupId}/transactions`);
    };

    const handleViewPlan = async () => {
        if (!group) return;
        try {
            const { totalAmount, duration, members, interest } = group;
            const response = await axios.post(
                'http://localhost:3000/api/groups/calculateChit',
                {
                    totalAmount,
                    months: duration,
                    members,
                    commission: interest,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                }
            );
            navigate('/plan-month', {
                state: { groupId, results: response.data.results, totalProfit: response.data.totalProfit },
            });
        } catch (err) {
            console.error('Error fetching group plan:', err);
            setError('Failed to fetch group plan.');
        }
    };

    const handleAccept = async (userId: string) => {
        if (!group) return;
    
        if (participants.length >= group.members) {
            setError("Cannot accept participant. The group is already full.");
            return;
        }
    
        try {
            const response = await axios.post(
                `http://localhost:3000/api/users/${groupId}/join-request/${userId}`,
                { action: 'accept' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                }
            );
    
            if (response.status === 200) {
                console.log(`Accepted ${userId}`);
                window.location.reload();
            }
        } catch (err) {
            console.error('Error accepting participant:', err);
        }
    };
    

    const handleReject = async (userId: string) => {
        try {
            const response = await axios.post(
                `http://localhost:3000/api/users/${groupId}/join-request/${userId}`,
                { action: 'reject' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                }
            );
            if (response.status === 200) {
                console.log(`Rejected ${userId}`);
                navigate(`/groups/${groupId}`);
            }
        } catch (err) {
            console.error('Error rejecting participant:', err);
        }
    };

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(date));
    };

    const getEndDate = (startDate: Date, duration: number): string => {
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + duration-1);
        return formatDate(endDate);
    };

    if (loading) return <div className="text-center text-lg font-bold text-gray-700">Loading...</div>;
    if (error) return <div className="text-center text-red-500 font-semibold">{error}</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-green-200 py-10 px-4">
            <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl">
                {group ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-semibold text-center text-red-700">{group.groupName}</h2>
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
                                                {requests.map((participant) => (
                                                    <li
                                                        key={participant.userId}
                                                        className="flex justify-between items-center p-2 hover:bg-gray-100"
                                                    >
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
                            <p><span className="font-semibold">Start Date:</span> {formatDate(group.createdAt)}</p>
                            <p><span className="font-semibold">End Date:</span> {getEndDate(group.createdAt, group.duration)}</p>
                        </div>
                        <p className="text-gray-600 mb-6">{group.description}</p>

                        <h3 className="text-xl font-semibold mt-6 mb-4">Participants:</h3>
                        <ul className="space-y-4 mb-6">
                            {participants.map((participant) => (
                                <li
                                    key={participant.userId}
                                    className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition"
                                >
                                    <span className="font-semibold">{participant.userName}</span>
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() => handleViewTransactions(participant.userId)}
                                    >
                                        View Transactions
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {user?.userRole === 'organizer' && (
                            <button
                                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition mb-6"
                                onClick={handleViewPlan}
                            >
                                View Monthly Plan
                            </button>
                        )}

                        {user?.userRole === 'participant' && (
                            <button
                                className="w-full bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-400 transition mb-6"
                                onClick={() => navigate(`/groups/${groupId}/installments`)}
                            >
                                My Installments
                            </button>
                        )}

                        <button
                            className="w-full bg-indigo-800 text-white py-2 px-4 rounded-md hover:bg-indigo-400 transition mb-6"
                            onClick={handleViewAllGroupTransactions}
                        >
                            View All Group Transactions
                        </button>

                        {transactions.length > 0 && (
                            <div>
                                <h4 className="text-xl font-semibold mt-4 mb-2">All Group Transactions</h4>
                                <ul className="space-y-2">
                                    {transactions.map((transaction) => (
                                        <li
                                            key={transaction.transactionId}
                                            className="flex justify-between bg-gray-100 p-3 rounded-md"
                                        >
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
