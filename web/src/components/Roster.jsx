import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { getAccounts } from "./FetchData";

//Created By Tyson
//The Home Page dedicated to future navigation of the page 

export default function Roster(){
    const navigate = useNavigate()
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const BASE_URL = 'http://localhost:8080/api/accounts';
        const [activeOverlay, setActiveOverlay] = useState(null)

useEffect(() => {
    getAccounts().then(Accounts => setEmployees(Accounts)) // Gets the resolved data
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