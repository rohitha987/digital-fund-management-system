// src/components/RegistrationPage.tsx
import React, { useState } from 'react';
import axios from 'axios';

const RegistrationPage: React.FC = () => {
  const initialFormData = {
    userId: '',
    userName: '',
    userEmail: '',
    password: '',
    userMobileNum: '',
    userAddress: '',
    userRole: 'participant'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    password: '',
    userMobileNum: '',
    userAddress: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    switch (name) {
      case 'userId':
        if (!value.trim()) errorMsg = 'User ID is required.';
        break;
      case 'userName':
        if (!value.trim()) errorMsg = 'Name is required.';
        break;
      case 'userEmail':
        if (!/\S+@\S+\.\S+/.test(value)) errorMsg = 'Email is invalid.';
        break;
      case 'password':
        if (value.length < 6) errorMsg = 'Password should be at least 6 characters.';
        break;
      case 'userMobileNum':
        if (!/^\d{10}$/.test(value)) errorMsg = 'Mobile number must be a 10-digit number.';
        break;
      case 'userAddress':
        if (!value.trim()) errorMsg = 'Address is required.';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
    return errorMsg === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = Object.keys(formData).every((key) =>
      validateField(key, formData[key as keyof typeof formData])
    );

    if (!isValid) {
      setError('Please correct the errors in the form.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:3000/api/auth/register', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      setSuccess(true);
      setError(null);
      setFormData(initialFormData); // Clear the form data on success
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data.message || 'Registration failed. Please try again.';
        setError(errorMessage);
      } else {
        setError('Registration failed. Please try again.');
      }
      setSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        
        {/* Success Alert */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">Registration successful!</span>
          </div>
        )}
        
        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {Object.keys(formData).map((field) => (
              field !== 'userRole' && (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-semibold mb-2" htmlFor={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type={field === 'password' ? 'password' : 'text'}
                    name={field}
                    id={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                    required
                    className={`w-full p-2 border rounded-md ${errors[field as keyof typeof errors] ? 'border-red-500' : ''}`}
                  />
                  {errors[field as keyof typeof errors] && (
                    <p className="text-red-500 text-sm">{errors[field as keyof typeof errors]}</p>
                  )}
                </div>
              )
            ))}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="userRole">User Role</label>
              <select
                name="userRole"
                id="userRole"
                value={formData.userRole}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="admin">Admin</option>
                <option value="participant">Participant</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-800 text-white p-2 rounded-md hover:bg-indigo-400"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
