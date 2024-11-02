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
        <nav className="flex justify-between items-center p-4 bg-black shadow-md w-full">
            <a href="/" className="text-xl font-semibold text-white hover:text-gray-400">DCFM</a>
            <div className="space-x-6 flex items-center">
                <Link to="/chitplans" className="text-gray-300 hover:text-white">Chit Plans</Link>
                <Link to="/mygroups" className="text-gray-300 hover:text-white">My Groups</Link>
                <Link to="/mytransactions" className="text-gray-300 hover:text-white">My Transactions</Link>
                <Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link>

                {isAuthenticated ? (
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-1 border border-gray-500 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="px-4 py-1 border border-gray-500 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200">
                                Log In
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="px-4 py-1 bg-red-700 text-white rounded-md hover:bg-red-500 transition-colors duration-200">
                                Register
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
