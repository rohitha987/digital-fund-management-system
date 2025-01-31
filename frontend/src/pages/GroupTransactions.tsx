import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Transaction {
    transactionId: string;
    transactionAmount: number;
    transactionDate: string; // Assuming the date is in ISO string format
    transactionType: string;
    transactionFrom: string; // Add transactionFrom field
    transactionTo: string; // Add transactionTo field
}

const GroupTransactions: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [userNames, setUserNames] = useState<{ [key: string]: string }>({}); // Store user names by userId
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
                const transactionsData: Transaction[] = response.data;
                setTransactions(transactionsData);
                setFilteredTransactions(
                    transactionsData.filter((tx) => tx.transactionType === 'debit') // Default to debit transactions
                );

                // Collect unique userIds (transactionFrom and transactionTo)
                const userIds = [
                    ...new Set(
                        transactionsData.flatMap((transaction) => [
                            transaction.transactionFrom,
                            transaction.transactionTo,
                        ])
                    ),
                ];

                // Fetch user names for each userId
                const fetchedUserNames: { [key: string]: string } = {};
                for (const userId of userIds) {
                    const userResponse = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    });
                    fetchedUserNames[userId] = userResponse.data.userName; // Assuming the API returns userName
                }

                setUserNames(fetchedUserNames); // Set the user names in state
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setError('Failed to fetch transactions.');
            }
        };

        fetchTransactions();
    }, [groupId]);

    // Filter by transaction type (debit)
    const filterDebits = () => {
        setFilteredTransactions(transactions.filter((tx) => tx.transactionType === 'debit'));
    };

    // Filter by month and ensure only debit transactions
    const filterByMonth = (month: number) => {
        setFilteredTransactions(
            transactions.filter(
                (tx) =>
                    tx.transactionType === 'debit' &&
                    new Date(tx.transactionDate).getMonth() === month - 1
            )
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10 px-4">
            <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">All Transactions for Group</h2>

                {error && <div className="text-red-500">{error}</div>}

                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                        onClick={filterDebits}
                    >
                        Show All
                    </button>
                    {/* Add a dropdown for month filter */}
                    <select
                        onChange={(e) => {
                            const selectedMonth = parseInt(e.target.value);
                            if (selectedMonth) {
                                filterByMonth(selectedMonth);
                            } else {
                                filterDebits(); // Show all debits if no specific month is selected
                            }
                        }}
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
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-indigo-200 text-indigo-900">
                                    <th className="py-4 px-6 border-b text-left">Transaction ID</th>
                                    <th className="py-4 px-6 border-b text-right">Amount</th>
                                    <th className="py-4 px-6 border-b text-left">Date</th>
                                    {/* <th className="py-4 px-6 border-b text-left">Type</th> */}
                                    <th className="py-4 px-6 border-b text-left">Transaction From</th>
                                    <th className="py-4 px-6 border-b text-left">Transaction To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction.transactionId} className="hover:bg-indigo-50">
                                        <td className="py-4 px-6 border-b text-gray-800">{transaction.transactionId}</td>
                                        <td className="py-4 px-6 border-b text-right text-gray-800">${transaction.transactionAmount}</td>
                                        <td className="py-4 px-6 border-b text-gray-800">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                                        {/* <td className="py-4 px-6 border-b text-gray-800">
                                            <span className="font-semibold px-3 py-1 rounded-full bg-red-200 text-red-800">
                                                {transaction.transactionType}
                                            </span>
                                        </td> */}
                                        <td className="py-4 px-6 border-b text-gray-800">{userNames[transaction.transactionFrom] || transaction.transactionFrom}</td>
                                        <td className="py-4 px-6 border-b text-gray-800">{userNames[transaction.transactionTo] || transaction.transactionTo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-600">No transactions found.</div>
                )}
            </div>
        </div>
    );
};

export default GroupTransactions;
