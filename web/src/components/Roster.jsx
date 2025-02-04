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
        <div className="p-4">
          <p className="text-xl font-semibold mb-4">This is the Roster</p>
      
          <div className="bg-white shadow-md rounded-lg p-4">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <div key={employee.accountId} className="mb-2">
                  <button
                    onClick={() => handleEmployeePress(employee)}
                    className="w-full p-3 bg-main-blue hover:bg-blue-600 text-white font-medium rounded-lg shadow-md flex flex-col items-start"
                  >
                    <p className="text-lg font-semibold">{employee.firstName} {employee.lastName}</p>
                    <p className="text-sm text-gray-200">Role: {employee.role}</p>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                {searchQuery ? "No matching results." : "No employees found."}
              </p>
            )}
          </div>
        </div>
      );
      
}