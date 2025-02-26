import { useEffect, useState } from "react";

export default function Vote() {

    const BASE_URL = 'http://localhost:8080/api';
    const [fetchError, setFetchError] = useState(null); 
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

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

    const handleSelection = (employeeId) => {
        setSelectedEmployee(employeeId);
    }

    const submitVote = () => {
        if (selectedEmployee) {
            console.log(`Voted for employee ID: ${selectedEmployee}`);
            fetch(`${BASE_URL}/vote`, { method: "POST", body: JSON.stringify({ employeeId: selectedEmployee }) });
        } else {
            alert("Please select an employee before voting!");
        }
    };


    return (
        <div style = {{textAlign: "center"}}>
            <h1 className = "text-3xl">
                Vote for the Employee of the Month!
            </h1>
            {fetchError && <p style={{ color: "red" }}>Error: {fetchError}</p>}
            <ul>
                {employees.map((employee) => (
                    <li key={employee.accountId}>
                        <label>
                            <input 
                                type="radio"
                                name="employeeVote"
                                value={employee.accountId}
                                checked={selectedEmployee === employee.accountId}
                                onChange={() => handleSelection(employee.accountId)}
                            />
                            {employee.firstName} {employee.lastName}    
                        </label>
                        
                    </li>
                ))}
            </ul>
            <button type="button" onClick={submitVote} style={{ marginTop: "10px", padding: "5px 10px", backgroundColor: "#3f6d89", color: "white"}}>
                Submit Vote!
            </button>
        </div>
    );
};