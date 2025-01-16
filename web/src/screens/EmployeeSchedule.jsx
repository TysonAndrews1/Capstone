import React from "react";
import { useNavigate } from "react-router-dom";

//Created By Michelle
//The will be the Employee Schedule screen where the employee can perform majority of their tasks. 

function EmployeeSchedule(){
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 relative">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 absolute top-0 w-full text-center">This is the Employee Schedule Screen</h1>
      <button
        className="bg-hover-blue text-white px-6 py-3 rounded shadow-md hover:bg-blue-600 mt-20 absolute top-0 text-center"
        onClick={() => navigate('/EmployeeSchedule')}
      >
        Employee
      </button>
    </div>
    );
}

export default EmployeeSchedule;