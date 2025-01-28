import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Overlay from "../Overlay";
import ShiftDetails from "./ShiftDetails";
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

  // Fetch shifts from the backend
  const fetchShifts = async () => {
    try {
      const response = await fetch(BASE_URL_SHIFT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setShifts(data); // Update shifts state
      setError(null); // Clear error state
    } catch (err) {
      console.error("Error fetching shifts:", err);
      setError("Failed to fetch shifts. Please try again later.");
    }
  };

  const FetchEmployees = async () =>{
    try {
        const response = await fetch(BASE_URL_EMP);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEmp(data); // Update shifts state
        
        setError(null); // Clear error state
      } catch (err) {
        console.error("Error fetching shifts:", err);
        setError("Failed to fetch shifts. Please try again later.");
      }
    };
  // Filter shifts whenever `selectedDay` or `shifts` changes
  useEffect(() => {
    const filtered = filterShiftsByDay(selectedDay, shifts);
    setFilteredShifts(filtered);
  }, [selectedDay, shifts]);

  // Fetch shifts when the component mounts
  useEffect(() => {
    fetchShifts();
  }, []);
  useEffect(() => {
    FetchEmployees();
  }, []);
  // Handle edit action
  const handleEdit = (shiftId) => {
    setEditing(!editing)
  };

  // Needs Implementing in backend
  const handleDelete = async (shiftId) => {
    try {
      const response = await fetch(`${BASE_URL_SHIFT}/${shiftId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Shift deleted successfully.");
        setShifts((prevShifts) => prevShifts.filter((shift) => shift.shiftId !== shiftId)); // Remove the deleted shift from state
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete the shift.");
      }
    } catch (err) {
      console.error("Error deleting shift:", err);
      alert("An error occurred while deleting the shift.");
    }
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
              <div className="flex space-x-2 mt-2">
                <ShiftDetails/>
                <button className="basic-button "onClick={() => handleEdit(shift.shiftId)}>Edit</button>
                <button className="basic-button "onClick={() => handleDelete(shift.shiftId)}>Delete</button>
              </div>}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
