import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface GroupData {
    createdAt: Date;
    totalAmount: number;
    duration: number;
    interest: number;
    monthlyDraw: string[]; // Include monthlyDraw as an array of user names
}

interface MonthlyPlanEntry {
    month: string;
    amount: string;
    commission: string;
    amountGiven: string;
    userName: string;
}

const MonthlyPlan: React.FC = () => {
    const location = useLocation();
    const groupId = location.state?.groupId;
    const [results, setResults] = useState<MonthlyPlanEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [groupData, setGroupData] = useState<GroupData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGroupData = async () => {
            if (!groupId) {
                setError('Group ID is not available.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setGroupData(response.data);
            } catch (err) {
                setError('Error fetching group data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupData();
    }, [groupId]);

    useEffect(() => {
        const fetchMonthlyPlan = async () => {
            if (!groupData) return;
            const { createdAt, totalAmount, interest, duration, monthlyDraw } = groupData;

            try {
                const response = await axios.post(
                    `http://localhost:3003/api/groups/${groupId}/plan`,
                    { createdAt, totalAmount, interest, duration },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                );

                const monthlyResults = response.data.results.map((entry: any, index: number) => ({
                    ...entry,
                    userName: monthlyDraw[index] || 'N/A', // Assign user names from monthlyDraw
                }));

                setResults(monthlyResults);
            } catch (err) {
                setError('Error fetching monthly plan data.');
                console.error(err);
            }
        };

        fetchMonthlyPlan();
    }, [groupData, groupId]);

    if (loading) {
        return <div className="text-center py-4 text-blue-600">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Monthly Plan</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Month</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Commission</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Amount Given</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Assigned User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((entry, index) => (
                            <tr key={index} className="even:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-700">{entry.month}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{entry.amount}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{entry.commission}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{entry.amountGiven}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{entry.userName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MonthlyPlan;
