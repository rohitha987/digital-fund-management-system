import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Transaction {
    transactionId: string;
    transactionAmount: number;
    transactionDate: Date;
    transactionType: 'credit' | 'debit';
    groupId: string;
    transactionFrom: string;
    transactionTo: string;
}

const MyTransaction: React.FC = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>([]);
    const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) {
                setError('User not logged in.');
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:3000/api/transactions/find/user/${user.userId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                );

                const transactionsData: Transaction[] = response.data;
                if (transactionsData.length === 0) {
                    setError('No transactions found.');
                    setIsLoading(false);
                    return;
                }

                setTransactions(transactionsData);
                setSortedTransactions(transactionsData);

                const userIds = [
                    ...new Set(
                        transactionsData.flatMap((transaction) => [
                            transaction.transactionFrom,
                            transaction.transactionTo,
                        ])
                    ),
                ];

                const fetchedUserNames: { [key: string]: string } = {};
                for (const userId of userIds) {
                    const userResponse = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    });
                    fetchedUserNames[userId] = userResponse.data.userName;
                }

                setUserNames(fetchedUserNames);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError('Failed to fetch transactions.');
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [user]);

    const handleSort = (criteria: string) => {
        let sortedData = [...transactions];
        if (criteria === 'date') {
            sortedData.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
        } else if (criteria === 'group') {
            sortedData.sort((a, b) => a.groupId.localeCompare(b.groupId));
        } else if (criteria === 'type') {
            sortedData.sort((a, b) => a.transactionType.localeCompare(b.transactionType));
        }
        setSortedTransactions(sortedData);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-GB'); // dd-mm-yyyy
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100 py-10 px-6">
            <div className="w-full max-w-5xl bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-4xl font-bold text-center mb-8 text-black-900">My Transactions</h2>
                {error && <div className="text-red-500 mb-6">{error}</div>}

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <div className="flex justify-between mb-6">
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleSort('date')}
                                    className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-500"
                                >
                                    Sort by Date
                                </button>
                                <button
                                    onClick={() => handleSort('group')}
                                    className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-500"
                                >
                                    Sort by Group
                                </button>
                                <button
                                    onClick={() => handleSort('type')}
                                    className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-500"
                                >
                                    Sort by Type
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {sortedTransactions.length > 0 ? (
                                sortedTransactions.map((transaction) => (
                                    <div
                                        key={transaction.transactionId}
                                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <div className="flex justify-between mb-4">
                                            <div className="text-lg font-semibold text-gray-800">
                                                {formatDate(transaction.transactionDate)}
                                            </div>
                                            <div
                                                className={`text-lg font-semibold ${
                                                    transaction.transactionType === 'credit'
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                {transaction.transactionType}
                                            </div>
                                        </div>

                                        <div className="text-xl font-bold text-gray-800 mb-2">
                                            ${transaction.transactionAmount.toFixed(2)}
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            <div>
                                                <span className="font-semibold">Group ID: </span>
                                                {transaction.groupId}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Transaction To: </span>
                                                {userNames[transaction.transactionTo] || transaction.transactionTo}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Transaction From: </span>
                                                {userNames[transaction.transactionFrom] ||
                                                    transaction.transactionFrom}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-600">No transactions found.</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyTransaction;
