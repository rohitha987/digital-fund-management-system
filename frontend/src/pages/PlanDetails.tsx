import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface CalculationResult {
    month: number;
    amount: number;
    commission: number;
    amountGiven: number;
}

const PlanDetails: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const { results, totalProfit, groupId } = location.state || { results: [], totalProfit: null, groupId: null };
    const [buttonLabel, setButtonLabel] = useState('Join');
    console.log('User Role:', user?.userRole);

    const handleJoinGroup = async (userId: string) => {
        if (!user || !userId || !groupId) return;

        try {
            const response = await fetch('http://localhost:3000/api/groups/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    groupId: groupId,
                    userId: userId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to join group');
            }

            const data = await response.json();
            console.log('Successfully joined group:', data);
            setButtonLabel('Request Sent Successfully');
            // Optionally, add any success feedback or redirection here
        } catch (error) {
            console.error('Error joining group:', error);
            setButtonLabel('Join');
            // Handle error feedback here
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-200 to-blue-200 py-10 px-4">
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-black-600">Chit Calculation Results</h2>
                {user?.userRole === 'participant' && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => handleJoinGroup(user.userId)}
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                        >
                            {buttonLabel}
                        </button>
                    </div>
                )}
                <table className="min-w-full bg-white border rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Month</th>
                            <th className="py-2 px-4 border-b">Amount</th>
                            <th className="py-2 px-4 border-b">Commission</th>
                            <th className="py-2 px-4 border-b">Amount Given</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result: CalculationResult, index: number) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">{`Month ${result.month}`}</td>
                                <td className="py-2 px-4 border-b">${result.amount}</td>
                                <td className="py-2 px-4 border-b">${result.commission}</td>
                                <td className="py-2 px-4 border-b">${result.amountGiven}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {user !== null ? (
                    totalProfit !== null ? (
                        <div className="mt-4 text-lg font-semibold">
                            Total Profit: ${totalProfit.toFixed(2)}
                        </div>
                    ) : null
                ) : (
                    <Link to='/login'>
                    <div className="mt-4 text-lg font-semibold hover:underline">
                        Log In to Join Group
                    </div>
                    </Link>
                )}

            </div>
        </div>
    );
};

export default PlanDetails;


