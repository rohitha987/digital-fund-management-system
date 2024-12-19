import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

interface Transaction {
    transactionAmount: number;
    transactionDate: string;
    groupId: string;
}

interface MonthStatus {
    monthName: string;
    ticketValue: number;
    isPaid: boolean;
}

const MonthlyTracker: React.FC = () => {
    const { user } = useAuth();
    const { groupId } = useParams<{ groupId: string }>();
    const [ticketValue, setTicketValue] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [installments, setInstallments] = useState<MonthStatus[]>([]);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setError('User not logged in.');
            return;
        }

        if (user.userRole !== 'participant') {
            setError('Access denied. Only participants can view this page.');
            return;
        }

        const fetchGroupDetailsAndTransactions = async () => {
            try {
                const groupResponse = await axios.get(`http://localhost:3000/api/groups/${groupId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setTicketValue(groupResponse.data.ticketValue);
                setDuration(groupResponse.data.duration);
                setStartDate(new Date(groupResponse.data.createdAt));

                const transactionsResponse = await axios.get(`http://localhost:3000/api/transactions/find/user/${user.userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                const userTransactions = transactionsResponse.data;

                const monthsList: MonthStatus[] = [];
                for (let i = 0; i < duration; i++) {
                    const currentMonth = new Date(startDate!);
                    currentMonth.setMonth(currentMonth.getMonth() + i);
                    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

                    const isPaid = userTransactions.some((transaction: Transaction) => {
                        const transactionDate = new Date(transaction.transactionDate);
                        return (
                            transactionDate.getMonth() === currentMonth.getMonth() &&
                            transactionDate.getFullYear() === currentMonth.getFullYear() &&
                            transaction.transactionAmount === ticketValue &&
                            transaction.groupId === groupId
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

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-8 bg-gradient-to-br from-blue-100 to-green-100">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Installment Tracker</h2>

            <button
                className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-400 transition duration-300 ease-in-out transform hover:scale-105 mb-6"
                onClick={handlePay}
            >
                Pay
            </button>

            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
                {installments.length > 0 ? (
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-indigo-800 text-white">
                                <th className="py-3 px-6 font-medium text-lg">Month</th>
                                <th className="py-3 px-6 font-medium text-lg">Ticket Value</th>
                                <th className="py-3 px-6 font-medium text-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {installments.map((installment, index) => (
                                <tr key={index} className="hover:bg-gray-100 transition duration-150">
                                    <td className="py-4 px-6 border-b text-gray-700">{installment.monthName}</td>
                                    <td className="py-4 px-6 border-b text-gray-700">${installment.ticketValue}</td>
                                    <td className="py-4 px-6 border-b">
                                        {installment.isPaid ? (
                                            <span className="inline-block px-3 py-1 rounded-full text-green-700 bg-green-200">Paid</span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 rounded-full text-red-700 bg-red-200">Unpaid</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="p-4 text-gray-500 text-center">No installments available.</p>
                )}
            </div>
        </div>
    );
};

export default MonthlyTracker;
