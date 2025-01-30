import React from 'react';
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';


/**
 * Personal Notes:
 * We need to create endpoints to get the logged-in employee data which will return the currently logged-in employee's details and shifts
 * We need to create an endpoint to get shifts for the chosen employee which will return the employee id and their scheduled shifts
 * 
 */

export default function TradeShift() {
  const [accounts, setAccounts] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedCoworker, setSelectedCoworker] = useState('');
  const [loggedInUser, setLoggedInUser] = useState({
    shifts: [
      { shiftId: 4, shiftStartDate: '2025-02-01 08:00', shiftEndDate: '2025-02-01 16:00' },
      { shiftId: 5, shiftStartDate: '2025-02-03 09:00', shiftEndDate: '2025-02-03 17:00' }
    ]
  });

  const BASE_URL = 'http://localhost:8080/api';

  // Function to fetch the logged-in user's data from the backend
  const fetchLoggedInUser = async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/accounts/user?email=${email}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLoggedInUser(data);
    } catch (error) {
      console.error('Error fetching logged-in user data:', error.message);
      throw error;
    }
  };



  // Function to fetch all employee banquet accounts from the backend 
  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/accounts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const employeeAccounts = data.filter(function(account) {
        return account.role === 'Employee'; 
      });
      setAccounts(employeeAccounts); // Update the state with the fetched accounts - filtered to only fetch the employee accounts
      console.log("Fetched accounts:", data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  const fetchShifts = async (accountId) => {
    try {
      const response = await fetch(`${BASE_URL}/shifts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const filteredShifts = data.filter(function(shift) {
        return shift.accountId === accountId;
      });
      setShifts(filteredShifts); // Update the state with the fetched shifts
      console.log("Fetched shifts:", data);
    } catch (err) {
      console.error('Error fetching shifts:', err);
    }
  };

    useEffect(() => {
      fetchAccounts();
    }, []);

    const handleCoworkerChange = (event) => {
      const accountId = parseInt(event.target.value, 10);
      setSelectedCoworker(accountId);
      if (accountId) {
        fetchShifts(accountId); // This will fetch the shifts for the selected coworker 
      } else {
        setShifts([]); // This will clear the shift if no coworker is selected 
      }
    };
 
    return (
      <div className="p-4">

        {/* Current Logged in User */}
        <div className="mb-4">
          <h1 className="text-lg font-bold mb-4">Current User</h1>
          <p>{loggedInUser.email}</p>
          <p>{loggedInUser.firstName} {loggedInUser.lastName}</p>
          
        </div>

        {/* Dropdown to select the current logged in user's shift */}
        <div className="mb-4">
          <h1 className="text-lg font-bold mb-4">Your Shifts</h1>
        <select className="w-full p-2 border border-gray-300 rounded">
          <option value="">-- Select Shift --</option>
          {loggedInUser.shifts.map((shift) => (<option key={shift.shiftId} value={shift.shiftId}>{shift.shiftStartDate} to {shift.shiftEndDate}</option>))}
        </select>
        </div>

        {/* Dropdown to select coworker */}
        <div className="mb-4">
          <h1 className="text-lg font-bold mb-4">Select Coworker</h1>
        <select 
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedCoworker}
          onChange={handleCoworkerChange}
          >
          <option value="">-- Select Coworker --</option>
          {accounts.map((account) => (
            <option key={account.accountId} value={account.accountId}>
              {account.firstName} {account.lastName}
            </option>
          ))}
        </select>
        </div>

        {/* Selected coworker's shift */}
        <div className="mb-4">
          <h1 className="text-lg font-bold mb-4">Available Shifts</h1>
        <select className="w-full p-2 border border-gray-300 rounded">
          <option value="">-- Select Shift --</option>
          {shifts.map((shift) => (
            <option key={shift.shiftId} value={shift.shiftId}>
              {shift.shiftStartDate} to {shift.shiftEndDate}
            </option>
          ))}
        </select>
        </div>

        {/* Button to trade shifts */}
        <div className="mb-4">
          <button className="bg-hover-blue hover:bg-main-blue text-white font-bold py-2 px-4 rounded">
            Trade Shift
          </button>
        </div>


      </div>
    );
    
}



