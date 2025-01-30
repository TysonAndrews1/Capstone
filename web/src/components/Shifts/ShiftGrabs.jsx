import React, { useState, useEffect } from "react"; 
import  { FaPlus } from "react-icons/fa";
import { getShifts } from "../FetchData";

export default function ShiftGrab() {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    getShifts().then(shifts => setShifts(shifts)) // Gets the resolved data
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Available Shifts</h1>
      {shifts.length === 0 ? (
        <p className="text-center text-gray-500">No shifts available</p>
      ) : (
        <div className="space-y-4">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg"
            >
            <div>
              <p className="text-sm">
                Start: {new Date(shift.shiftStartDate).toLocaleString()}
              </p>
              <p className="text-sm">
                End: {new Date(shift.shiftEndDate).toLocaleString()}
              </p>
            </div>
            <FaPlus className="text-hover-blue hover:text-main-blue cursor-pointer"/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
