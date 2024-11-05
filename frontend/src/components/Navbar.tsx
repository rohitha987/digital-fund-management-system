// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/image (3).png';


const Navbar: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout(); // Call logout from context
    };

    return (
        <nav className="flex justify-between items-center p-4 bg-black shadow-md w-full">
            <div className="flex items-center">
        <a href='/'><img src={logo} alt="Digital Chit Fund Management Logo" className="md:h-12 lg:h-14 ml-7" /></a> {/* Adjust 'h-10' for logo size */}
        <span className="ml-3 text-lg font-semibold">Digital Chit Fund Management</span>
      </div>
            <div className="space-x-6 flex items-center">
                <Link to="/chitplans" className="text-gray-300 hover:text-white">Chit Plans</Link>
                <Link to="/mygroups" className="text-gray-300 hover:text-white">My Groups</Link>
                <Link to="/mytransactions" className="text-gray-300 hover:text-white">My Transactions</Link>
                <Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link>

                {isAuthenticated ? (
                    <Link to="/">
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-1 border border-gray-500 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                        Logout
                    </button>
                    </Link>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="px-4 py-1 border border-gray-500 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200">
                                Log In
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="px-4 py-1 bg-indigo-800 text-white rounded-md hover:bg-indigo-400 transition-colors duration-200">
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
