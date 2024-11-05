// AddPayment.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const AddPayment: React.FC = () => {
    const location = useLocation();
    const amountGiven = location.state?.amountGiven;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Add Payment</h2>
            <p className="text-center text-gray-700 mb-4">Amount Due: {amountGiven}</p>
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200">
                Proceed with Payment
            </button>
        </div>
    );
};

export default AddPayment;
