import React, { useState, useEffect } from "react";
import { getCurrentUser } from "./FetchData";


export default function TimeOffRequest(){
    const [requestType, setRequestType] = useState("");
    const [requestStartDate, setRequestStartDate] = useState("");
    const [requestEndDate, setRequestEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [accountId, setAccountId] = useState(null); // state to store the current user's account ID
    const [loading, setLoading] = useState(true); // State to handle loading state
    const [error, setError] = useState(null); // State to handle errors

    const BASE_URL = 'http://localhost:8080/api';

    // Fetch the logged-in user's account_id when the component mounts
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                setAccountId(user.accountId); // Set the account_id from the fetched user
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = () => {
        if (!accountId) {
            alert("Error", "User not logged in or account ID not found");
            return;
        }

        const newRequest = {
            account_id: accountId, // Use the logged-in user's account_id
            request_type: requestType,
            start_date: requestStartDate,
            end_date: requestEndDate,
            details: description,
            status: "PENDING",
        };

        const testRequest = {
            account_id: 2,
            request_type: "Time Off",
            start_date: "2025-01-01T09:00",
            end_date: "2025-01-01T17:00",
            details: "Vacation",
            status: "PENDING",
        }

        console.log('Submitting request:', testRequest);

        fetch(`${BASE_URL}/requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testRequest),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            alert("Success", "Time off request created successfully");
        })
        .catch((error) => {
            console.error('Error creating time off request:', error);
            alert("Error", "Failed to create time off request");
        });
    }

    // Show loading or error state
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
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
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option className="text-gray-700">Select a Request Type</option>
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
                    className="bg-hover-blue hover:bg-main-blue text-white font-bold py-2 px-4 rounded"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

