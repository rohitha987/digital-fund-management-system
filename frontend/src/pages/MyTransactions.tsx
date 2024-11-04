import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Transaction {
    transactionId: string;
    transactionAmount: number;
    transactionDate: Date;
    transactionType: 'credit' | 'debit';
    groupId: string;
    userId: string;
}

const MyTransaction: React.FC = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>([]);
    const [sortBy, setSortBy] = useState<string>('date'); // Default sort by date
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) {
                setError('User not logged in.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/api/transactions/find/user/${user.userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setTransactions(response.data);
                setSortedTransactions(response.data); // Initialize sorted transactions
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError('Failed to fetch transactions.');
            }
        };

        fetchTransactions();
    }, [user]);

    const handleSort = (criteria: string) => {
        setSortBy(criteria);
        let sortedData = [...transactions];

        if (criteria === 'group') {
            sortedData.sort((a, b) => a.groupId.localeCompare(b.groupId));
        } else if (criteria === 'month') {
            sortedData.sort((a, b) => new Date(a.transactionDate).getMonth() - new Date(b.transactionDate).getMonth());
        } else if (criteria === 'type') {
            sortedData.sort((a, b) => a.transactionType.localeCompare(b.transactionType));
        } else {
            // Default sort by date
            sortedData.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
        }

        setSortedTransactions(sortedData);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100 py-10 px-4">
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">My Transactions</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="flex justify-between mb-4">
                    <div>
                        <button onClick={() => handleSort('date')} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            Sort by Date
                        </button>
                        <button onClick={() => handleSort('group')} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2">
                            Sort by Group
                        </button>
                        <button onClick={() => handleSort('month')} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2">
                            Sort by Month
                        </button>
                        <button onClick={() => handleSort('type')} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2">
                            Sort by Type
                        </button>
                    </div>
                </div>

                <table className="min-w-full bg-white border rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Transaction ID</th>
                            <th className="py-2 px-4 border-b">Amount</th>
                            <th className="py-2 px-4 border-b">Date</th>
                            <th className="py-2 px-4 border-b">Type</th>
                            <th className="py-2 px-4 border-b">Group ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTransactions.length > 0 ? (
                            sortedTransactions.map(transaction => (
                                <tr key={transaction.transactionId}>
                                    <td className="py-2 px-4 border-b">{transaction.transactionId}</td>
                                    <td className="py-2 px-4 border-b">${transaction.transactionAmount}</td>
                                    <td className="py-2 px-4 border-b">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b">{transaction.transactionType}</td>
                                    <td className="py-2 px-4 border-b">{transaction.groupId}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-2 px-4 text-center">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyTransaction;
