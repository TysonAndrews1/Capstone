import React, { useState, useEffect } from "react"; 
import  { FaPlus } from "react-icons/fa";
import { getCurrentUser } from "../../components/FetchData";


export default function ShiftGrab() {
  const [shifts, setShifts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const BASE_URL = 'http://localhost:8080/api';

  const fetchShifts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/shifts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching shifts:', err);
      return [];
    }
  };

  // Function to fetch all employee accounts
  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/accounts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const employeeAccounts = data.filter(acc => acc.role === 'Employee');
      return employeeAccounts;
    } catch (err) {
      console.error('Error fetching accounts:', err);
      return [];
    }
  };
    

  // Function to fetch and merge shifts with account data
  const fetchAvailableShifts = async () => {
    try {
      const [shiftData, accountData] = await Promise.all([fetchShifts(), fetchAccounts()]);
      // Filter shifts to only include those that belong to employees
      const employeeShifts = shiftData.filter(shift => 
        accountData.some(acc => acc.accountId === shift.accountId)
      );
      // Map shifts to their corresponding employee details
      const enrichedShifts = employeeShifts.map((shift) => {
        const employee = accountData.find(acc => acc.accountId === shift.accountId);
        return {
          ...shift,
          firstName: employee?.firstName || "Unknown",
          lastName: employee?.lastName || "Employee",
        };
      });
      setShifts(enrichedShifts);
      setAccounts(accountData);
      console.log("Fetched shifts with names:", enrichedShifts);
    } catch (err) {
      console.error('Error fetching available shifts:', err);
    }
  };

  // Function to send a request to the manager to grab the shift
  const requestShiftGrab = async (shiftId) => {
    try {
      const response = await fetch(`${BASE_URL}/employee_requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          account_id: loggedInUser.accountId,
          request_type: 'Availability Change',
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
          details: `Request to grab shift with ID ${shiftId}`,
          status: 'PENDING',
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      alert('Your request to grab the shift has been submitted.');
      console.log('Shift grab request sent:', data);
    } catch (err) {
      console.error('Error requesting shift grab:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUser();
        setLoggedInUser(userData);
        await fetchAvailableShifts();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredShifts = shifts.filter(shift => shift.accountId !== loggedInUser?.accountId);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Available Shifts</h1>
      {filteredShifts.length === 0 ? (
        <p className="text-center text-gray-500">No shifts available</p>
      ) : (
        <div className="space-y-4">
          {filteredShifts.map((shift) => (
            <div
              key={shift.id}
              className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg">

              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">
                  {shift.firstName} {shift.lastName}
                </p>
                <FaPlus
                className="text-hover-blue hover:text-main-blue cursor-pointer"
                onClick={() => requestShiftGrab(shift.id)}/>
              </div>
              <div>
                
                <p className="text-sm">
                  Start: {new Date(shift.shiftStartDate).toLocaleString()}
                </p>
                <p className="text-sm">
                  End: {new Date(shift.shiftEndDate).toLocaleString()}
                </p>
                
              </div>
              
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
