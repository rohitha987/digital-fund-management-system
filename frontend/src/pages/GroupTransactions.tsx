// src/components/GroupTransactions.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Transaction {
    transactionId: string;
    transactionAmount: number;
    transactionDate: string; // Assuming the date is in ISO string format
    transactionType: string;
    userId: string;
}

const GroupTransactions: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/transactions/find/group/${groupId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setTransactions(response.data);
                setFilteredTransactions(response.data);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError('Failed to fetch transactions.');
            }
        };

        fetchTransactions();
    }, [groupId]);

    // Filter by transaction type
    const filterByType = (type: string) => {
        setFilteredTransactions(transactions.filter(tx => tx.transactionType === type));
    };

    // Filter by month
    const filterByMonth = (month: number) => {
        setFilteredTransactions(transactions.filter(tx => new Date(tx.transactionDate).getMonth() === month - 1));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10 px-4">
            <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">All Transactions for Group</h2>
                
                {error && <div className="text-red-500">{error}</div>}

                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                        onClick={() => setFilteredTransactions(transactions)} // Reset filter
                    >
                        Show All
                    </button>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
                        onClick={() => filterByType('credit')}
                    >
                        Show Credits
                    </button>
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                        onClick={() => filterByType('debit')}
                    >
                        Show Debits
                    </button>
                    {/* Add a dropdown for month filter */}
                    <select
                        onChange={(e) => filterByMonth(parseInt(e.target.value))}
                        className="bg-gray-200 py-2 px-4 rounded-md text-gray-700"
                    >
                        <option value="">Select Month</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>

                {filteredTransactions.length > 0 ? (
                    <ul className="space-y-2">
                        {filteredTransactions.map((transaction) => (
                            <li key={transaction.transactionId} className="flex justify-between bg-gray-100 p-3 rounded-md">
                                <span>{new Date(transaction.transactionDate).toLocaleDateString()}</span>
                                <span>${transaction.transactionAmount}</span>
                                <span className="capitalize">{transaction.transactionType}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-gray-600">No transactions found.</div>
                )}
            </div>
        </div>
    );
};

export default GroupTransactions;
