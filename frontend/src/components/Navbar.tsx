// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="flex justify-between items-center p-4 bg-white shadow-md w-full">
            <h1 className="text-lg font-semibold">DFMS</h1>
            <div className="space-x-4 flex items-center">
                {/* Use Link components instead of <a> tags for navigation */}
                <Link to="/home" className="text-gray-600 hover:text-gray-800">Home</Link>
                <Link to="/chitplans" className="text-gray-600 hover:text-gray-800">Chit Plans</Link>
                <Link to="/faqs" className="text-gray-600 hover:text-gray-800">FAQs</Link>
                <Link to="/contact" className="text-gray-600 hover:text-gray-800">Contact</Link>
                <Link to="/login">
                <button className="px-4 py-1 border rounded-md hover:bg-gray-200">Log In</button>
                </Link>
                
                {/* Link for Register button */}
                <Link to="/register">
                    <button className="px-4 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600">Register</button>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
