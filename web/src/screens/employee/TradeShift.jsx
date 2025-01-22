import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


/**
 * Personal Notes:
 * We need to create endpoints to get the logged-in employee data which will return the currently logged-in employee's details and shifts
 * We need to create an endpoint to get shifts for the chosen employee which will return the employee id and their scheduled shifts
 * 
 */

export default function TradeShift() {
  const [accounts, setAccounts] = useState([]);
  const BASE_URL = 'http://localhost:8080/api/accounts';

  // Function to fetch all banquet accounts from the backend 
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${BASE_URL}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAccounts(data); // Update the state with the fetched accounts
      console.log("Fetched accounts:", data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  // example date to see if working 
  // const mockAccounts = [
  //   {accountId: 1, firstName: 'John'},
  //   {accountId: 2, firstName: 'Jane'},
  // ]

    useEffect(() => { 
      fetchEvents();
    }, []);
 
    return (
      <div className="p-4">

        {/* Current Logged in User */}
        <div className="mb-4">
          <h1 className="text-lg font-bold mb-4">Current User</h1>
        </div>

        {/* Dropdown to select the current logged in user's shift */}
        <div className="mb-4">
          <h1 className="text-lg font-bold mb-4">Your Shifts</h1>
        <select className="w-full p-2 border border-gray-300 rounded">
          <option value="">-- Select Shift --</option>
        </select>
        </div>

        {/* Dropdown to select coworker */}
        <div className="mb-4">
          <h1 className="text-lg font-bold mb-4">Select Coworker</h1>
        <select className="w-full p-2 border border-gray-300 rounded">
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
        </select>
        </div>

      </div>
    );
    
}



