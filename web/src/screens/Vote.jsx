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
    const [loggedInUserRole, setLoggedInUserRole] = useState(null);
    const [votes, setVotes] = useState([]);

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

    const fetchVoteCounts = async () => {
        try {
            const response = await fetch(`${BASE_URL}/votes`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const voteData = await response.json();
            setVotes(voteData);
        } catch (error) {
            console.error("Error fetching votes:", error);
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
            setLoggedInUserRole(user.role);
            checkIfUserHasVoted(user.accountId);
        });
        fetchVoteCounts();
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
            voteWeight: 1.0 
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
            fetchVoteCounts();
            window.location.reload();
        } catch (error) {
            alert(`Error submitting vote: ${error.message}`);
        }
    };

    // Function to get vote count for each employee
    const getVoteCountForEmployee = (employeeId) => {
        return votes.filter(vote => vote.nomineeId === employeeId).length;
    };

    const finalizeWinner = async () => {
        if (votes.length === 0) {
            alert("No votes have been cast yet.");
            return;
        }
    
        // Find the employee with the most votes
        const voteCounts = employees.map(emp => ({
            employee: emp,
            count: getVoteCountForEmployee(emp.accountId)
        }));
        
        const topEmployee = voteCounts.reduce((max, emp) => emp.count > max.count ? emp : max, voteCounts[0]);

        if (topEmployee.count === 0) {
            alert("No votes recorded. Cannot finalize winner.");
            return;
        }
        
        const winnerData = {
            accountId: topEmployee.employee.accountId,
            firstName: topEmployee.employee.firstName,
            lastName: topEmployee.employee.lastName,
        };

        try {
            const response = await fetch(`${BASE_URL}/winner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(winnerData),
            });
    
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            alert(`${topEmployee.employee.firstName} ${topEmployee.employee.lastName} is the Employee of the Month!`);
            window.location.reload();
        } catch (error) {
            alert(`Error finalizing winner: ${error.message}`);
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
                <div className="h-1/2=">
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

            {/* Manager View */}
            {loggedInUserRole === 'Manager' && (
                <div className="flex mt-6">
                    
                    {/* Left Side - Employee Vote Counts */}
                    <div className="w-1/2 mx-auto px-4 md:px-8 border-r border-t">
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl p-2 text-left">
                            Vote Count
                        </h3>
                        <div className="shadow-sm border rounded-lg overflow-x-auto">
                            <table className="w-full table-auto text-md text-left">
                                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                    <tr className="bg-gray-400 text-white" style={{ backgroundColor: "#3f6d89" }}>
                                        <th className="border border-gray-300 px-4 py-2">Employee</th>
                                        <th className="border border-gray-300 px-4 py-2">Votes</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 divide-y">
                                    {employees
                                    .slice()
                                    .sort((a, b) => getVoteCountForEmployee(b.accountId) - getVoteCountForEmployee(a.accountId))
                                    .map((employee, index) => (
                                        <tr key={employee.accountId} className={"px-6 py-4 whitespace-nowrap"}>
                                            <td className="border border-gray-300 px-4 py-2">
                                            {employee.firstName} {employee.lastName}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                            {getVoteCountForEmployee(employee.accountId)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Side - Votes and Reasons */}
                    <div className="w-1/2 mx-auto px-4 md:px-8 border-r border-t">
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl p-2 text-left">
                            Message Board
                        </h3>
                        {votes.length > 0 ? (
                            <ul className="space-y-3 max-h-80 overflow-y-auto pr-3">
                                {votes.map((vote, index) => {
                                    const nominee = employees.find(emp => emp.accountId === vote.nomineeId);
                                    if (!nominee) return null;

                                    const isRight = index % 2 === 0; // Alternate alignment (even index: right, odd index: left)

                                    return (
                                        <li
                                            key={vote.voteId}
                                            className={`text-left p-3 rounded-lg shadow-sm max-w-xs ${isRight ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-black mr-auto'}`}
                                        >
                                            <p><strong>Nominee:</strong> {nominee.firstName} {nominee.lastName}</p>
                                            <p><strong>Reason:</strong> {vote.reason}</p>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No votes yet.</p>
                        )}
                    </div>
                </div>
                
            )}
            {loggedInUserRole === 'Manager' && (
            <button 
                onClick={finalizeWinner}
                className="mt-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
                End Voting & Finalize Winner
            </button>
            )}
        </div>
    );
};