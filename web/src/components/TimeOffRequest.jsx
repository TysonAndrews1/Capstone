import React, { useState } from "react";


export default function TimeOffRequest(){
    const [requestType, setRequestType] = useState("");
    const [requestStartDate, setRequestStartDate] = useState("");
    const [requestEndDate, setRequestEndDate] = useState("");
    const [description, setDescription] = useState("");

    const BASE_URL = 'http://localhost:8080/api';

    const handleSubmit = () => {
            const newRequest = {
                account_id: 1, // Hardcoded for now
                requestType: requestType,
                requestStartDate: requestStartDate,
                requestEndDate: requestEndDate,
                description: description,
                status: "PENDING",
            };

            console.log('Submitting request:', newRequest);

            fetch(`${BASE_URL}/employee_requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRequest),
            })
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error creating time off request:', error);
                alert("Error", "Failed to create time off request");
            });
    }

return (
    <div className="p-4 bg-gray-100 shadow rounded">
        <div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Request Type:
                </label>
                <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                >
                    <option value="Time Off">Time Off</option>
                    <option value="Sick Day">Sick Day</option>
                    <option value="Availability Change">Availability Change</option>
                </select>

            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Start Date:
                </label>
                <input
                    type="datetime-local"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={requestStartDate}
                    onChange={(e) => setRequestStartDate(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    End Date:
                </label>
                <input
                    type="datetime-local"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={requestEndDate}
                    onChange={(e) => setRequestEndDate(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Description:
                </label>
                <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    </div>
)}