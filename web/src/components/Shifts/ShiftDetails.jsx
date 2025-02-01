import React, {useState} from "react";
import { useNavigate } from "react-router-dom";


export default function ShiftDetails({shift}){
    const [editing, setEditing] = useState(shift === null);
    const [firstName, setFirstName] = useState(shift?.firstName || "");
    const [shiftStartDate, setShiftStartDate] = useState(shift?.shiftStartDate || "");
    const [shiftEndDate, setShiftEndDate] = useState(shift?.shiftEndDate || "");
    const [description, setDescription] = useState(shift?.description || "");

    const ToggleEditing = () => {
        setEditing(!editing); 
      };
    const handleSave = () =>{
      const BASE_URL = 'http://localhost:8080/api/events';
      const newEvent = {
          // shiftId: shiftId,
          // accountId: accountId,
          shiftStartDate: shiftStartDate,
          shiftEndDate: shiftEndDate,
          description: description,
        };

        fetch(`${BASE_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
          })
          .then((response) => response.json())
          .catch((error) => {
            console.error('Error creating event:', error);
            alert("Error", "Failed to create event");
          });
    }
    const handleDelete = () =>{

    }
return (
    <div className="p-4 bg-gray-100 shadow rounded">
      {editing ? (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
               First Name:
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          ) : (
    <div>
    <p><strong>First Name:</strong> {firstName}</p>
    <p><strong>Start Time:</strong> {shiftStartDate}</p>
    <p><strong>End Time:</strong> {shiftEndDate}</p>
    <p><strong>Description:</strong> {description}</p>
    <button
      onClick={() => setEditing(true)}
      className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
    >
      Edit
    </button>
  </div>
  )} 
   </div>
          
)}