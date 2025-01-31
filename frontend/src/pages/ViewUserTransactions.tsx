import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Transaction {
    transactionId: string;
    transactionAmount: number;
    transactionDate: string;
    transactionType: string;
    userId: string;
}

const ViewUserTransactions: React.FC = () => {
    const { groupId, userId } = useParams<{ groupId: string; userId: string }>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useAuth();

    // Format date as dd-mm-yyyy
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = new Date(date).toLocaleDateString('en-GB', options); // 'en-GB' uses dd-mm-yyyy format
        return formattedDate;
    };

    useEffect(() => {
        const fetchGroupTransactions = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/transactions/find/group/${groupId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                );

                const filteredTransactions = response.data.filter(
                    (transaction: Transaction) => transaction.userId === userId
                );
                setTransactions(filteredTransactions);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError('Failed to fetch transactions.');
            } finally {
                setLoading(false);
            }
        };

        fetchGroupTransactions();
    }, [groupId, userId]);

    if (loading) return <div className="text-center text-lg font-bold text-gray-700">Loading...</div>;
    if (error) return <div className="text-center text-red-500 font-semibold">{error}</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-green-300 py-10 px-4">
            <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-6">User Transactions</h2>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">Group ID: {groupId}</h3>

                {transactions.length > 0 ? (
                    <div className="space-y-6">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction.transactionId}
                                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-lg font-semibold text-gray-700">
                                        <span className="text-gray-500">Date: </span>{' '}
                                        {formatDate(transaction.transactionDate)}
                                    </div>
                                    <div
                                        className={`text-lg font-semibold ${
                                            transaction.transactionType === 'credit'
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                        }`}
                                    >
                                        {transaction.transactionType}
                                    </div>
                                </div>

                                <div className="text-xl font-bold text-gray-800 mb-2">
                                    ${transaction.transactionAmount.toFixed(2)}
                                </div>

                                <div className="text-sm text-gray-600">
                                    <span className="font-semibold">Transaction ID: </span>
                                    {transaction.transactionId}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-600">No transactions available for this user.</div>
                )}
            </div>
        </div>
    );
};

export default ViewUserTransactions;
