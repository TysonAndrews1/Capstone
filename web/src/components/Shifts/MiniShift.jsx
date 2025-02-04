import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Overlay from "../Overlay";
import ShiftDetails from "./ShiftDetails";
import { getAccounts,getShifts } from "../FetchData";
//A small shift which opens a overlay to allow editing or deletion
// created using chatgpt for array manipulation and HTML formatting

function format(date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

// Utility function to filter shifts by a specific day
function filterShiftsByDay(day, shifts) {
  if (!day || !shifts) return [];
  return shifts.filter((shift) =>shift.shiftStartDate.split("T")[0] === day.toISOString().split("T")[0]
  );
}

export default function MiniShift({ selectedDay }) {
  const [shifts, setShifts] = useState([]); // State to store all shifts
  const [filteredShifts, setFilteredShifts] = useState([]); // State for filtered shifts
  const [emp, setEmp] = useState([]); // State to store all shifts
  const [filteredEmp, setFilteredEmp] = useState([]); // State for filtered shifts
  const [error, setError] = useState(null); // State for error handling
  const [editing, setEditing] = useState(false)
  const [activeOverlay, setActiveOverlay] =useState(false)
  const navigate = useNavigate();
  const BASE_URL_SHIFT = "http://localhost:8080/api/shifts";
  const BASE_URL_EMP = "http://localhost:8080/api/accounts";

  // Filter shifts whenever `selectedDay` or `shifts` changes
  useEffect(() => {
    const filtered = filterShiftsByDay(selectedDay, shifts);
    setFilteredShifts(filtered);
  }, [selectedDay, shifts]);

  // Fetch shifts when the component mounts
  useEffect(() => {
    getShifts().then(shifts => setShifts(shifts)) // Gets the resolved data
  }, []);
  useEffect(() => {
    getAccounts().then(accounts => setEmp(accounts)) // Gets the resolved data  
  }, []);
  // Handle edit action
  const handleEdit = (shiftId) => {
    setEditing(!editing)
  };

function getName(empID) {
    const employee = emp.find((Employee) => Employee.accountId === empID); // Use find instead of forEach
    return employee ? employee.firstName : "Unknown";
}

  return (
    <div className="container">
      {/* Error Message */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Display filtered shifts */}
      {filteredShifts.length === 0 ? (
        <p className="text-center text-gray-500 my-4">No Shifts Today.</p>
      ) : (
        <div className="scroll-container">
          {filteredShifts.map((shift) => (
            <div key={shift.shiftId} className="p-4 bg-white shadow rounded my-2" onClick={() => setActiveOverlay(!activeOverlay)}>
              {/* Shift Details */}
              <p className="font-bold">Name: {getName(shift.accountId)}</p>
              <p>Start Time: {shift.shiftStartDate.split("T")[1]}</p>
            <p >view Details</p>
              {/* Actions: Edit & Delete */}
              <Overlay  headerTitle ={shift.accountId} ButtonTitle={"Test"} buttonPlacement={"invisible pointer-events-none"} isActive={activeOverlay} onToggle={setActiveOverlay} child= {
              <div className="flex space-x-2 mt-2 flex-col">
                <ShiftDetails/>
              </div>}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
