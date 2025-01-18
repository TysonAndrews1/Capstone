import React, { useState } from 'react';

// Created by Michelle Tran
// This is the Profile screen where the employee can view and edit their profile information
// Will work on how to change the profile information based on the user role
// Will figure out how these fields will be populated with the user's information from the database

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [employeeNumber, setEmployeeNumber] = useState('12345'); //This employee number would be generated and retrieved from the database
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [phoneNumber, setPhoneNumber] = useState('123-456-7890');
  const [email, setEmail] = useState('john.doe@example.com');

  const handleEditClick = () => {
    // This is where the fields would be enabled for editing
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    // This is where you would save the updated profile information
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
      <form className="bg-white p-6 rounded-2xl shadow-md w-80">
        <div className="mb-4">
          <label className="block text-gray-700">Employee Number</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="flex justify-end">
          {isEditing ? (
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleSaveClick}
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleEditClick}
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Profile;