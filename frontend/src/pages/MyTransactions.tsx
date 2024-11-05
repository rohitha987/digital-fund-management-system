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
    const [sortBy, setSortBy] = useState<string>('date');
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
                setSortedTransactions(response.data);
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
            sortedData.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
        }

        setSortedTransactions(sortedData);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100 py-10 px-6">
            <div className="w-full max-w-5xl bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-4xl font-bold text-center mb-8 text-black-900">My Transactions</h2>
                {error && <div className="text-red-500 mb-6">{error}</div>}

                <div className="flex justify-between mb-6">
                    <div className="flex space-x-4">
                        <button onClick={() => handleSort('date')} className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-500">
                            Sort by Date
                        </button>
                        <button onClick={() => handleSort('group')} className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-500">
                            Sort by Group
                        </button>
                        <button onClick={() => handleSort('month')} className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-500">
                            Sort by Month
                        </button>
                        <button onClick={() => handleSort('type')} className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-500">
                            Sort by Type
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-sm">
                        <thead>
                            <tr className="bg-indigo-200 text-indigo-900">
                                <th className="py-4 px-6 border-b text-left">Transaction ID</th>
                                <th className="py-4 px-6 border-b text-right">Amount</th>
                                <th className="py-4 px-6 border-b text-left">Date</th>
                                <th className="py-4 px-6 border-b text-left">Type</th>
                                <th className="py-4 px-6 border-b text-left">Group ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTransactions.length > 0 ? (
                                sortedTransactions.map(transaction => (
                                    <tr key={transaction.transactionId} className="hover:bg-indigo-50">
                                        <td className="py-4 px-6 border-b text-gray-800">{transaction.transactionId}</td>
                                        <td className="py-4 px-6 border-b text-right text-gray-800">${transaction.transactionAmount.toFixed(2)}</td>
                                        <td className="py-4 px-6 border-b text-gray-800">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                                        <td className="py-4 px-6 border-b text-gray-800">
                                            <span className={`font-semibold px-3 py-1 rounded-full ${transaction.transactionType === 'credit' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                {transaction.transactionType}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 border-b text-gray-800">{transaction.groupId}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-4 px-6 text-center text-gray-600">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyTransaction;
