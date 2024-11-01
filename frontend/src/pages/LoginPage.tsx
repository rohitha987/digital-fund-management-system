import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    userEmail: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
};

  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const userResponse = await axios.get(
          `http://localhost:3000/api/users/email/${formData.userEmail}`,
          {
            headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}` },
          }
        );
        console.log('User data:', userResponse.data);

        // Navigate based on user role
        if (userResponse.data.userRole === 'participant') {
          navigate('/');
        } else if (userResponse.data.userRole === 'organizer') {
          navigate('/organizer/home');
        } else if (userResponse.data.userRole === 'admin') {
          navigate('/admin/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setError('Failed to fetch user data.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Form data being submitted:', formData);

      const response = await axios.post(
        'http://127.0.0.1:3000/api/auth/login',
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log('Response from server:', response.data);

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token); // Store token
        setSuccess(true);
        setError(null);
        await fetchUserData(); // Fetch user data right after login
      }
    } catch (err) {
      console.error('Error during login:', err);

      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data.message || 'Login failed. Please try again.';
        console.error('Error message from server:', errorMessage);
        setError(errorMessage);
      } else {
        setError('Login failed. Please try again.');
      }
      setSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {success && <div className="text-green-500 mb-4">Login successful!</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="userEmail">
              Email
            </label>
            <input
              type="email"
              name="userEmail"
              id="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
