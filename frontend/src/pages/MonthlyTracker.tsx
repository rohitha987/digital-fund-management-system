import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import your Auth context
import { useNavigate, useParams } from 'react-router-dom';

interface Transaction {
    transactionAmount: number;
    transactionDate: string;
    groupId: string; // Ensure this field is included
}

interface MonthStatus {
    monthName: string;
    ticketValue: number;
    isPaid: boolean;
}

const MonthlyTracker: React.FC = () => {
    const { user } = useAuth(); // Get user information from the context
    const { groupId } = useParams<{ groupId: string }>(); // Only get groupId from params
    const [ticketValue, setTicketValue] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [installments, setInstallments] = useState<MonthStatus[]>([]);
    const [error, setError] = useState<string | null>(null); // To handle errors

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroupDetailsAndTransactions = async () => {
            if (!user) {
                setError('User not logged in.');
                return;
            }

            try {
                // Fetch group details
                const groupResponse = await axios.get(`http://localhost:3000/api/groups/${groupId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setTicketValue(groupResponse.data.ticketValue);
                setDuration(groupResponse.data.duration);
                setStartDate(new Date(groupResponse.data.createdAt));

                // Fetch user's transactions for this group using userId from auth context
                const transactionsResponse = await axios.get(`http://localhost:3000/api/transactions/find/user/${user.userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                const userTransactions = transactionsResponse.data;

                // Generate month list based on startDate and duration
                const monthsList: MonthStatus[] = [];
                for (let i = 0; i < duration; i++) {
                    const currentMonth = new Date(startDate!);
                    currentMonth.setMonth(currentMonth.getMonth() + i);
                    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

                    // Check if there's a matching transaction for the groupId, month, year, and ticket value
                    const isPaid = userTransactions.some((transaction: Transaction) => {
                        const transactionDate = new Date(transaction.transactionDate);
                        return (
                            transactionDate.getMonth() === currentMonth.getMonth() &&
                            transactionDate.getFullYear() === currentMonth.getFullYear() &&
                            transaction.transactionAmount === ticketValue &&
                            transaction.groupId === groupId // Check groupId as well
                        );
                    });

                    monthsList.push({
                        monthName,
                        ticketValue,
                        isPaid,
                    });
                }

                setInstallments(monthsList);
            } catch (error) {
                console.error('Error fetching installments:', error);
                setError('Failed to fetch installments.');
            }
        };

        fetchGroupDetailsAndTransactions();
    }, [groupId, user, startDate, ticketValue, duration]);

    const handlePay = () => {
        if (user) {
            navigate(`/groups/${groupId}/users/${user.userId}`, { state: { ticketValue } });
        } else {
            setError('User not logged in.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-8">
            <h2 className="text-2xl font-semibold mb-6">Installment Tracker</h2>
            {error && <div className="text-red-500">{error}</div>} {/* Display any error messages */}

            <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4"
                onClick={handlePay}
            >
                Pay
            </button>

            <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
                {installments.length > 0 ? (
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Month</th>
                                <th className="py-2 px-4 border-b">Ticket Value</th>
                                <th className="py-2 px-4 border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {installments.map((installment, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b">{installment.monthName}</td>
                                    <td className="py-2 px-4 border-b">${installment.ticketValue}</td>
                                    <td className="py-2 px-4 border-b">
                                        {installment.isPaid ? (
                                            <span className="text-green-500">Paid</span>
                                        ) : (
                                            <span className="text-red-500">Unpaid</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No installments available.</p>
                )}
            </div>
        </div>
    );
};

export default MonthlyTracker;
