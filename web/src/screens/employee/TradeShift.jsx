import React, { useState, useEffect } from 'react';

/**
 * Created by: Michelle Tran
 * This function allows employees to trade shifts with their coworkers
 */
function TradeShift() {
  const [employeeShifts, setEmployeeShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');

  useEffect(() => {
    // Fetch employee shifts
    fetchEmployeeShifts();
  }, []);

  const fetchEmployeeShifts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/employee_shifts");
      if (!response.ok) {
        throw new Error("Failed to fetch employee shifts.");
      }
      const shifts = await response.json();
      setEmployeeShifts(shifts);
    } catch (error) {
      console.error("Error fetching shifts:", error.message);
    }
  };

  const handleSubmit = async (event) => {
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Trade Request</h1>
      <form>
        {/* Select Current User's Shift */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Shift
          </label>
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="" disabled>
              Select a shift
            </option>
            {employeeShifts.map((shift, index) => (
              <option key={index} value={shift.id}>
                {shift.time}
              </option>
            ))}
          </select>
        </div>

        {/* Select Coworker */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Coworker
          </label>
          <select>
            <option value="" disabled>
              Select a coworker
            </option>
          </select>
        </div>

        {/* Select Coworker Shift */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Shift
          </label>
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="" disabled>
              Select a shift
            </option>
            {employeeShifts.map((shift, index) => (
              <option key={index} value={shift.id}>
                {shift.time}
              </option>
            ))}
          </select>
        </div>
        

        <button
          type="submit"
          className="w-full bg-hover-blue text-white font-bold p-2 rounded hover:bg-main-blue"
        >
          Send Offer
        </button>
      </form>
    </div>
  );
}

export default TradeShift;