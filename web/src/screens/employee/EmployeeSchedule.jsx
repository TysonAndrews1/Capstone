import React from 'react';
import { useNavigate } from 'react-router-dom';



/**
 * Created by: Michelle Tran
 * The EmployeeSchedule component is the main screen for employees to view their schedule, trade shifts, and change availability.
 */
function EmployeeSchedule() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-100">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-10">Employee Schedule</h1>

      {/* Calendar Component */}
      <div className="flex-grow flex items-center justify-center w-full">
        {/* The Calendar component will be placed here */}
        <div className="w-3/4 h-3/4 bg-white shadow-md rounded-lg flex items-center justify-center">
          <h2 className="text-xl text-gray-700">The Calendar will go here</h2>
          
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex justify-around bg-gray-100 py-4">
        <button
          className="bg-hover-blue text-white px-10 py-3 rounded shadow-md hover:bg-main-blue"
          onClick={() => navigate('/EmployeeSchedule')}
        >
          Grabs
        </button>
        <button
          className="bg-hover-blue text-white px-10 py-3 rounded shadow-md hover:bg-main-blue"
          onClick={() => navigate('/EmployeeSchedule')}
        >
          View Shift
        </button>
        <button
          className="bg-hover-blue text-white px-10 py-3 rounded shadow-md hover:bg-main-blue"
          onClick={() => navigate('/TradeShift')}
        >
          Trades
        </button>
        <button
          className="bg-hover-blue text-white px-10 py-3 rounded shadow-md hover:bg-main-blue"
          onClick={() => navigate('/EmployeeSchedule')}
        >
          Change Availability
        </button>
      </div>
    </div>
  );
}

export default EmployeeSchedule;
