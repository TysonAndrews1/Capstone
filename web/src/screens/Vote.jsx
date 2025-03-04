import { useEffect, useState } from "react";
import { getCurrentUser } from "../components/FetchData";

export default function Vote() {

    const BASE_URL = 'http://localhost:8080/api';
    const [fetchError, setFetchError] = useState(null); 
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null); //Nominee
    const [reason, setReason] = useState(""); // Reason for nomination 
    const [loggedInUserID, setLoggedInUserID] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

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

    const checkIfUserHasVoted = async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/votes?accountId=${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const votes = await response.json();
            
            // Check if any vote has the same accountId as the logged-in user
            const userHasVoted = votes.some(vote => vote.accountId === userId);
            setHasVoted(userHasVoted); // Set the state based on the vote check
        } catch (error) {
            console.error("Error checking vote status:", error.message);
        }
    };
    

    useEffect(() => {
        fetchEmployeeData();
        getCurrentUser().then(user => {
            setLoggedInUserID(user.accountId);
            checkIfUserHasVoted(user.accountId);
        });
    }, []);

    // Handle employee selection
    const handleSelection = (employeeId) => {
        setSelectedEmployee(employeeId === selectedEmployee ? null : employeeId);
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
            
            window.location.reload();
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
            <div style={{marginBottom: "20px"}}>
                <h1 className = "text-3xl">
                    Vote for the Employee of the Month!
                </h1>
            </div>
            {fetchError && <p style={{ color: "red" }}>Error: {fetchError}</p>}
            
            {/* If the user has already voted, show a message */}
            {hasVoted ? (
                <div>
                    <p>You have already voted for this month!</p>
                </div>
            ) : (
                <>
                    {/* Employee Selection Grid */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {employees
                        .filter(employee => employee.accountId !== loggedInUserID)
                        .map((employee) => (
                            <div
                                key={employee.accountId}
                                className={`p-4 border rounded-lg shadow-md cursor-pointer transition-all w-56 ${
                                    selectedEmployee === employee.accountId ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                                }`}
                                onClick={() => handleSelection(employee.accountId)}
                            >
                                <h2 className="text-lg font-semibold">{employee.firstName} {employee.lastName}</h2>
                            </div>
                        ))}
                    </div>
                    
                    {/* Reason Input */}
                    <div style={{ marginBottom: "10px" }}>
                        <textarea
                            value={reason}
                            onChange={handleReason}
                            placeholder="Why does this employee deserve to win?"
                            rows="4"
                            style={{
                                width: "75%",
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
                </>
            )}
        </div>
    );
};