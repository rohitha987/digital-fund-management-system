import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const generateTransactionId = () => {
    return `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const AddTransaction: React.FC = () => {
    const { state } = useLocation();
    const { groupId, userId } = useParams<{ groupId: string; userId: string }>();
    const navigate = useNavigate();
    const [amount, setAmount] = useState<number>(state.ticketValue);
    const [error, setError] = useState<string | null>(null);
    const [organizerId, setOrganizerId] = useState<string | null>(null);

    // Fetch organizer's ID from the Group Service
    useEffect(() => {
        const fetchOrganizer = async () => {
            try {
                const response = await axios.get(`http://localhost:3003/api/groups/getOrganizer/${groupId}`);
                if (response.data.organizerId) {
                    setOrganizerId(response.data.organizerId);
                } else {
                    setError('Organizer not found for this group');
                }
            } catch (error) {
                setError('Failed to fetch organizer ID');
            }
        };

        fetchOrganizer();
    }, [groupId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure the organizerId is available before submitting
        if (!organizerId) {
            setError('Organizer not found. Please try again later.');
            return;
        }

        const transactionId = generateTransactionId();

        try {
            console.log(userId, groupId, amount, new Date().toISOString(), transactionId, organizerId);
            await axios.post(
                `http://localhost:3000/api/transactions`,
                {
                    transactionId,
                    userId,
                    groupId,
                    transactionAmount: amount,
                    transactionType: 'debit', // Assuming the user is making a payment (debit)
                    transactionDate: new Date().toISOString(),
                    transactionFrom: userId, // Sender is the user making the payment
                    transactionTo: organizerId, // Recipient is the group organizer
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                }
            );
            navigate(-1); // Navigate back after success
        } catch (error) {
            console.error('Error adding transaction:', error);
            setError('Failed to add transaction. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-green-100 py-12 px-6">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-semibold text-center text-indigo-900 mb-6">Pay Installment</h2>
                <form onSubmit={handleSubmit}>
                    <p className="mb-4 text-gray-700 text-lg">
                        <strong>Month:</strong> {state.monthName}
                    </p>
                    <p className="mb-6 text-gray-700 text-lg">
                        <strong>Ticket Value:</strong> ${state.ticketValue}
                    </p>
                    <label className="block text-gray-600 text-lg mb-2">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-indigo-800 text-white py-3 rounded-lg font-medium hover:bg-indigo-600 transition duration-200"
                    >
                        Confirm Payment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransaction;
