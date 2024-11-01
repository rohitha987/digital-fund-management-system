import React, { useState } from 'react';
import axios from 'axios';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    password: '',
    userMobileNum: '',
    userAddress: '',
    userRole: 'participant'
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Log form data before sending
      console.log('Form data being submitted:', formData);

      const response = await axios.post('http://127.0.0.1:3000/api/auth/register', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    });
      console.log('Response from server:', response.data); // Log server response

      setSuccess(true);
      setError(null);
    } catch (err) {
      // Log the full error object for debugging
      console.error('Error during registration:', err);

      if (axios.isAxiosError(err)) {
        // This is an Axios error
        const errorMessage = err.response?.data.message || 'Registration failed. Please try again.';
        console.error('Error message from server:', errorMessage); // Log server error message
        setError(errorMessage);
      } else {
        // This is a different kind of error
        setError('Registration failed. Please try again.');
      }
      setSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        {success && <div className="text-green-500 mb-4">Registration successful!</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="userId">
              User ID
            </label>
            <input
              type="text"
              name="userId"
              id="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="userName">
              Name
            </label>
            <input
              type="text"
              name="userName"
              id="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
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
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="userMobileNum">
              Mobile Number
            </label>
            <input
              type="text"
              name="userMobileNum"
              id="userMobileNum"
              value={formData.userMobileNum}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="userAddress">
              Address
            </label>
            <input
              type="text"
              name="userAddress"
              id="userAddress"
              value={formData.userAddress}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="userRole">
              Role
            </label>
            <select
              name="userRole"
              id="userRole"
              value={formData.userRole}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="participant">Participant</option>
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
