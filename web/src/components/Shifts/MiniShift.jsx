import React, { useEffect, useState } from "react";
import Overlay from "../Overlay";
import ShiftDetails from "./ShiftDetails";
import { getAccounts,getShifts } from "../FetchData";

//A small shift which opens a overlay to allow editing or deletion
// created using chatgpt for array manipulation and HTML formatting


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
  const [error, setError] = useState(null); // State for error handling
  const [activeOverlay, setActiveOverlay] =useState(false)

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

function getName(empID) {
    const employee = emp.find((Employee) => Employee.accountId === empID); // Use find instead of forEach
    return employee ? employee.firstName : "Unknown";

}
const toggleOverlay = (shiftId) => {
  console.log(activeOverlay);
  
  if (activeOverlay === shiftId) {
    setActiveOverlay(false) 
  }else{
    setActiveOverlay(shiftId)
  }
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
            <div key={shift.shiftId} className="p-4 bg-white shadow rounded my-2">
              {/*mini in schedule*/ }
              <div onClick={() => toggleOverlay(shift.shiftId)}>
              <p className="font-bold">Name: {getName(shift.accountId)}</p>
              <p>Start Time: {shift.shiftStartDate.split("T")[1]}</p>
            <p >view Details</p>
            </div>
            {/*Overlay*/ }
            <div>
              <Overlay  headerTitle ={"View Shift"} ButtonTitle={"View Shift"} buttonPlacement={"opacity-0 pointer-events-none"} isActive={activeOverlay === shift.shiftId} onToggle={setActiveOverlay} child= {
              <div className="flex space-x-2 mt-2 flex-col">
                <ShiftDetails shift={shift}/>
              </div>}/>
            </div>
        </div>
          ))}
        </div>
      )}
    </div>
  );
}
