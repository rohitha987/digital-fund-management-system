// src/components/AddTransaction.tsx
import React, { useState } from 'react';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const transactionId = generateTransactionId();

        try {
            console.log(userId, groupId, amount, new Date().toISOString(), transactionId);
            await axios.post(
                `http://localhost:3000/api/transactions`,
                {
                    transactionId,
                    userId,
                    groupId,
                    transactionAmount: amount,
                    transactionType: 'debit', // assuming debit for payments
                    transactionDate: new Date().toISOString(),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                }
            );
            navigate(-1); // Redirect back to the MonthlyTracker page
        } catch (error) {
            console.error('Error adding transaction:', error);
            setError('Failed to add transaction. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-8">
            <h2 className="text-2xl font-semibold mb-4">Pay Installment</h2>
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    <p className="mb-4">
                        <strong>Month:</strong> {state.monthName}
                    </p>
                    <p className="mb-4">
                        <strong>Ticket Value:</strong> ${state.ticketValue}
                    </p>
                    <label className="block text-gray-700 mb-2">Amount:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full mb-4 p-2 border rounded"
                        required
                    />
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Confirm Payment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransaction;
