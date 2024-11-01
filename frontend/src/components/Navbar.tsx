// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout(); // Call logout from context
    };

    return (
        <nav className="flex justify-between items-center p-4 bg-white shadow-md w-full">
            <h1 className="text-lg font-semibold">DFMS</h1>
            <div className="space-x-4 flex items-center">
                <Link to="/chitplans" className="text-gray-600 hover:text-gray-800">Chit Plans</Link>
                <Link to="/mygroups" className="text-gray-600 hover:text-gray-800">My Groups</Link>
                <Link to="/mytransactions" className="text-gray-600 hover:text-gray-800">My Transactions</Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-800">Profile</Link>

                {isAuthenticated ? (
                    <Link to="/">
                        <button onClick={handleLogout} className="px-4 py-1 border rounded-md hover:bg-gray-200">
                        Logout
                    </button>
                    </Link>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="px-4 py-1 border rounded-md hover:bg-gray-200">Log In</button>
                        </Link>
                        <Link to="/register">
                            <button className="px-4 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600">Register</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
