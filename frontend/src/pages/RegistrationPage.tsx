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
    validateField(name, value);  // Validate each field on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check if all fields are valid
    const isValid = Object.keys(formData).every((key) =>
      validateField(key, formData[key as keyof typeof formData])
    );

    if (!isValid) {
      setError('Please correct the errors in the form.');
      return;
    }

    try {
      console.log('Form data being submitted:', formData);
      const response = await axios.post('http://127.0.0.1:3000/api/auth/register', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      console.log('Response from server:', response.data);

      setSuccess(true);
      setError(null);
    } catch (err) {
      console.error('Error during registration:', err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data.message || 'Registration failed. Please try again.';
        console.error('Error message from server:', errorMessage);
        setError(errorMessage);
      } else {
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
          {Object.keys(formData).map((field) => (
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
          ))}
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
