// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import Profile from './pages/profile';
import EditProfile from './pages/EditProfile';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/editProfile" element={<EditProfile />} />
                {/* Add other routes here as needed */}
            </Routes>
            </div>
        </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
