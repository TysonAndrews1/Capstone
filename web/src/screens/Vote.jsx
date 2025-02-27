import { useEffect, useState } from "react";

export default function Vote() {

    const BASE_URL = 'http://localhost:8080/api';
    const [fetchError, setFetchError] = useState(null); 
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(""); //Nominee
    const [reason, setReason] = useState(""); // Reason for nomination 

    const loggedInUserID = 2; // For testing

    const fetchEmployeeData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/accounts`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const employeeList = data.filter((account) => account.role === 'Employee');
            setEmployees(employeeList);
        } catch (error) {
            setFetchError(error.message);
        }
    };

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    // Handle employee selection
    const handleSelection = (event) => {
        setSelectedEmployee(event.target.value);
    }

    // Handle reason input
    const handleReason = (event) => {
        setReason(event.target.value);
    }
    
    // Submit vote to the backend
    const submitVote = async () => {
        if (!selectedEmployee || reason.trim() === "") {
            alert("Please select an employee and provide a reason before voting.");
            return;
        } 

        /**
         * Reference: ChatGPT 
         * Prompt: How can I format the date to match my backend? Backend looks like this "2025-02-25T10:30:00"
        **/
        const voteData = {
            accountId: parseInt(loggedInUserID),
            nomineeId: parseInt(selectedEmployee),
            voteDate: new Date().toISOString().slice(0, 19), //Use ChatGPT to help with formatting
            reason,
            voteWeight: 1.0 // Set to 1 for testing purpose, will change base on if either employee or manager is logged in.
        };

        try {
            const response = await fetch(`${BASE_URL}/votes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(voteData),
            })

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            alert("Vote submitted successfully!");
            setSelectedEmployee(""); // Reset nominee
            setReason(""); // Reset reason
        } catch (error) {
            alert(`Error submitting vote: ${error.message}`);
        }
    };

    /**
     * Reference: MDN Web Docs for HTML Styling
     * Source: https://developer.mozilla.org/en-US/docs/Web/HTML
     * Used to help understand and remember HTML styling concepts.
     */
    return (
        <div style = {{textAlign: "center"}}>
            <h1 className = "text-3xl">
                Vote for the Employee of the Month!
            </h1>
            {fetchError && <p style={{ color: "red" }}>Error: {fetchError}</p>}
            
            {/* Employee Selection Dropdown */}
            <div style={{ marginBottom: "10px" }}>
                <select
                    value = {selectedEmployee}
                    onChange={handleSelection}
                    style={{
                        padding: "8px",
                        fontSize: "16px",
                        margin: "10px",
                        borderRadius: "5px"
                    }}
                >
                    <option value="" disabled>-- Select an Employee --</option>
                    {employees.map((employee) => (
                        <option key = {employee.accountId} value = {employee.accountId}>
                            {employee.firstName} {employee.lastName}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Reason Input */}
            <div style={{ marginBottom: "10px" }}>
                <textarea
                    value={reason}
                    onChange={handleReason}
                    placeholder="Why does this employee deserve to win?"
                    rows="4"
                    style={{
                        width: "80%",
                        padding: "8px",
                        margin: "10px",
                        borderRadius: "5px",
                        fontSize: "16px",
                    }}
                >
                </textarea>
            </div>

            {/* Submit Vote Button */}
            <button type="button" onClick={submitVote} style={{ marginTop: "10px", padding: "5px 10px", backgroundColor: "#3f6d89", color: "white"}}>
                Submit Vote!
            </button>
        </div>
    );
};