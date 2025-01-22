import React from 'react';
import { use } from 'react';
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
  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/accounts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAccounts(data); // Update the state with the fetched accounts
      console.log(data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  // example date to see if working 
  const mockAccounts = [
    {accountId: 1, firstName: 'John'},
    {accountId: 2, firstName: 'Jane'},
  ]

    useEffect(() => { 
      setAccounts(mockAccounts);
    }, []);
 
    return (
      <div className="p-4">
        <h1 className="text-lg font-bold mb-4">Select Coworker</h1>
        <select className="w-full p-2 border border-gray-300 rounded">
          <option value="">-- Select Coworker --</option>
          {accounts.map((accounts) => (
            <option key={accounts.accountId} value={accounts.accountId}>
              {accounts.firstName}
            </option>
          ))}
        </select>
      </div>
    );
    
}

