import React from 'react';
import { useLocation } from 'react-router-dom';

interface CalculationResult {
    month: number;
    amount: number;
    commission: number;
    amountGiven: number;
}

const PlanDetails: React.FC = () => {
    const location = useLocation();
    const { results, totalProfit } = location.state || { results: [], totalProfit: null };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-200 to-blue-200 py-10 px-4">
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-black-600">Chit Calculation Results</h2>
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
                {totalProfit !== null && (
                    <div className="mt-4 text-lg font-semibold">
                        Total Profit: ${totalProfit.toFixed(2)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanDetails;
