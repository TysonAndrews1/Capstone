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
    const BASE_URL = 'http://localhost:8080/api/events'; //update for employees

useEffect(() => {
    
    const fetchEmployees = async (timeframe) => {
        setError(true);
        try {
            const response = await fetch(`${BASE_URL}/filter?timeframe=${timeframe}`);
            if (!response.ok) {
                throw new Error('Error fetching employees');
            }
            const data = await response.json();
            console.log(data);
            
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
                        <button
                        key={employee.id}
                        onPress={() => handleEmployeePress(employee)}>
                        <p >{employee.name}</p>
                        <p >Role: {employee.role}</p>
                        </button>
                        ))
                    ) : (
                        <p>
                        {searchQuery ? 'No matching results.' : 'No employees found.'}
                        </p>
                    )}
</div>
</div>)
}