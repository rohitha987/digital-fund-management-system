import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const GroupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    groupId: '',
    groupName: '',
    members: '',
    totalAmount: '',
    interest: '',
    organizerId: '',
    groupType: '',
    duration: '',
    ticketValue: '',
    description: '',
  });
  const { user, setUser } = useAuth(); // Access user data from context
  const navigate = useNavigate();
  // Check if the user is an organizer
  if (user?.userRole !== 'organizer') {
    return <div className="text-center text-red-500">You do not have permission to access this page.</div>;
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value, }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      formData.ticketValue = formData.members && formData.members
        ? (parseFloat(formData.totalAmount) / parseInt(formData.members)).toFixed(2)
        : '0.00';
      const response = await axios.post('http://localhost:3000/api/groups', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
      );
      const User = await axios.patch(`http://localhost:3000/api/users/addGroup/${user.userEmail}`, {
        "groupId": `${formData.groupId}`
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      },)
      setUser(User.data);
      console.log('Group created successfully:', response.data,User.data);
      navigate('/mygroups'); // Redirect to groups page after creating a new group
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creating group:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
      <h2 className="text-2xl font-semibold text-center">Group Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text"
          name="groupId"
          placeholder="Enter group Id"
          value={formData.groupId}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text"
          name="groupName"
          placeholder="Enter group name"
          value={formData.groupName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="number"
          name="members"
          placeholder="Enter number of members"
          value={formData.members}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="number"
          name="totalAmount"
          placeholder="Enter total amount"
          value={formData.totalAmount}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text"
          name="interest"
          placeholder="Enter group interest"
          value={formData.interest}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text"
          name="organizerId"
          placeholder="Enter organizer ID"
          value={formData.organizerId}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text"
          name="groupType"
          placeholder="Enter group type"
          value={formData.groupType}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="text"
          name="duration"
          placeholder="Enter duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="number"
          name="ticketValue"
          placeholder="Ticket Value (calculated)"
          value={formData.members && formData.members
            ? (parseFloat(formData.totalAmount) / parseInt(formData.members)).toFixed(2)
            : '0.00'}
          readOnly // Make it read-only since it's calculated
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
      </div>
      <textarea name="description"
        placeholder="Enter group description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200">
        Save </button>
    </form>
  );
};
export default GroupForm;