import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { getAccounts, getEvents } from "../FetchData";
import Select from "react-select"
import { getCurrentUser } from "../FetchData";



  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
  
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Ensures AM/PM format
    });
  };


export default function ShiftDetails({shift}){
    const [editing, setEditing] = useState(shift === null);
    const [selectedEmployees, setSelectedEmployees] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [employeeOptions, setEmployeeOptions] = useState([])
    const [eventOptions, setEventOptions] = useState([])
    const [shiftStartDate, setShiftStartDate] = useState(shift?.shiftStartDate || "");
    const [shiftEndDate, setShiftEndDate] = useState(shift?.shiftEndDate || "");
    const [description, setDescription] = useState(shift?.description || "");
    const [currentRole, setCurrentRole] = useState("Employee")
    useEffect(()=>{
      getCurrentUser().then((user)=>{setCurrentRole(user.role)})
    },[])

    const BASE_URL_SHIFT = "http://localhost:8080/api/shifts";

    const ToggleEditing = () => {
        setEditing(!editing); 
      };
    const handleSave = async () =>{
 if (selectedEmployees.length === 0 || !selectedEvent || !shiftStartDate || !shiftEndDate || !description.trim()) {
        console.log(("Error", "All fields are required."));
        return;
    }
      const shiftPromises = selectedEmployees.map((employee) => {
        console.log(employee.value);
        console.log(selectedEvent);
        
        
        const shiftData = {
            accountId: employee.value, 
            eventId: selectedEvent.value,
            shiftStartDate: shiftStartDate,
            shiftEndDate: shiftEndDate,
            description: description.trim(),
            swappable: null
        };
        console.log(shiftData);
        

        // Post each shift to all selected employees
        return fetch(`${BASE_URL_SHIFT}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shiftData),
        });
    });
 try {
       // Wait for all the POST requests (one for each employee) to complete
       // shiftPromises is an array of fetch requests, and Promise.all runs them in parallel
         const responses = await Promise.all(shiftPromises); 
 
         // Check for any failed requests by filtering the responses
         // A response is considered failed if the 'ok' property is false
         const failedResponses = responses.filter((response) => !response.ok);
 
         if (failedResponses.length > 0) {
          failedResponses.forEach((response) => {
              response.text().then((text) => {
                  console.log("Failed response:", text); // Log the error response
              });
          });
      }else {
             console.log("Success", "Shifts assigned successfully to all selected employees.");
             resetFields();
         }
     } catch (error) {
      console.log("Error", "An error occurred while saving shifts.");
     }
 };

    const handleDelete = async(shiftId) =>{
      try {
        const response = await fetch(`${BASE_URL_SHIFT}/${shiftId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Shift deleted successfully.");
        } else {
          const data = await response.json();
          alert(data.message || "Failed to delete the shift.");
        }
      } catch (err) {
        console.error("Error deleting shift:", err);
        alert("An error occurred while deleting the shift.");
      }
    }
    useEffect(() => {
      getAccounts().then((accounts) => {
        const formattedOptions = accounts.map((account) => ({
          value: account.accountId,
          label: `${account.firstName} ${account.lastName}`,
        }));
        setEmployeeOptions(formattedOptions);
      });
    }, []);

    useEffect(() => {
      getEvents().then((events) => {
        const formattedOptions = events.map((event) => ({
          value: event.eventId,
          label: `${event.eventName}`,
        }));
        setEventOptions(formattedOptions);
      });
    }, []);
      // reset all the data.
  const resetFields = () => {
    setSelectedEmployees([]); 
    setSelectedEvent(null); 
    setShiftStartDate(null); 
    setShiftEndDate(null); 
    setDescription(''); 
};
return (
    <div className="p-4 bg-gray-100 shadow rounded">
      {editing ? (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
               Employee's:
            </label>
      {/* Employee Dropdown */}
      <Select
        isMulti
        options={employeeOptions}
        placeholder="Select Employee(s)"
        value={selectedEmployees}
        onChange={setSelectedEmployees}
        className="mb-3"
      />
              </div>
              <div>
      {/* Attach Event Dropdown */}
      <Select
        options={eventOptions}
        placeholder="Attach Event"
        value={selectedEvent}
        onChange={setSelectedEvent}
        className="mb-3"
      />
                </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Start Time:
                </label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={shiftStartDate}
                  onChange={(e) => setShiftStartDate(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  End Time:
                </label>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={shiftEndDate}
                  onChange={(e) => setShiftEndDate(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description:
                </label>
                <textarea
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button
                onClick={handleSave}
                className="basic-button"
              >
                Save
              </button>
            </div>
          ) : (
    <div>
    <p><strong>First Name:</strong></p>
    <p><strong>Start Time:</strong> {formatDate(shiftStartDate)}</p>
    <p><strong>End Time:</strong> {formatDate(shiftEndDate)}</p>
    <p><strong>Description:</strong> {description}</p>

    {currentRole === "Manager" && (
      <>
      <div className=" w-full justify-center">
    <button onClick={() => setEditing(true)} className="basic-button my-2">
      Edit
    </button>
    <button onClick={() => handleDelete(shift.shiftId)} className="basic-button">
      Delete
    </button>
    </div>
    </>
    )}
  </div>
  )} 
   </div>
          
)}