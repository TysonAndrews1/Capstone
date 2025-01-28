import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";

//Created By Tyson
//The Home Page dedicated to future navigation of the page 

export default function Roster(){
    const navigate = useNavigate()
    const [employees, setEmployees] = useState([]);
    
        const [filteredEmployees, setFilteredEmployees] = useState([]);
        const [searchQuery, setSearchQuery] = useState('');
            const [error, setError] = useState(null);
    const BASE_URL = 'http://localhost:8080/api/accounts'; //update for employees
        const [activeOverlay, setActiveOverlay] = useState(null)

useEffect(() => {
    
    const fetchEmployees = async () => {
        setError(true);
        try {
            const response = await fetch(`${BASE_URL}`);
            if (!response.ok) {
                throw new Error('Error fetching employees');
            }
            const data = await response.json();
            // console.log(data);
            
            setEmployees(data);
            setFilteredEmployees(data);
        } catch (error) {
            console.error(error);
            setError('Error', 'Failed to fetch employee accounts.');
        }
    };

    fetchEmployees(); // calling fetchEmployees will load the data
}, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredEmployees(employees); // If the search is empty, show all employees
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = employees.filter((emp) =>
            emp.name.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredEmployees(filtered);
        }
        }, [searchQuery, employees]);


       function handleEmployeePress(employee){
        navigate()
       }
return (

<div>
This is the Roster

<div>
    {filteredEmployees.length > 0 ? (filteredEmployees.map((employee) => (
                        <div>
                            <button key={employee.accountId} onClick={() => handleEmployeePress(employee)}>    
                        <p>{employee.firstName}{employee.accountId}</p>
                        <p >Role: {employee.role}</p>
                        </button></div>
                        ))
                    ) : (
                        <p>{searchQuery ? 'No matching results.' : 'No employees found.'}</p>
                    )}
</div>
</div>)
}