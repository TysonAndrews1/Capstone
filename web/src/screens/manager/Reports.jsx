import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";


/**
 * [1] Code Complete. Learn React ChartJS in 8 Minutes | Complete Guide. (Sep. 24, 2023). Accessed: Feb. 24, 2025. [Online Video]. Available: https://www.youtube.com/watch?v=6q5d3Z1-5kQ&ab_channel=CodeComplete
 * [2] Chart.js (4.4.8.). "Configuration." Accessed: Feb. 24, 2025. [Online]. Available: https://www.chartjs.org/docs/4.4.8/configuration/
 * [3] Chart JS. Fetch and Display Advanced JSON Data in Chart JS. (Sep. 20, 2021). Accessed: Feb. 25, 2025. [Online Video]. Available: https://www.youtube.com/watch?v=mw5i_QGDomw
 */


// [3]
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); 

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [filteredData, setFilteredData] = useState([]);


  // Filter states 
  const [accounts, setAccounts] = useState([]); 
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(""); 
  

  const BASE_URL = "http://localhost:8080/api";

  // Function to fetch all employee banquet accounts from the backend
  useEffect(() => {
    const fetchAccounts = async () => {
        try {
          const response = await fetch(`${BASE_URL}/accounts`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const employeeAccounts = data.filter(function(account) {
            return account.role === 'Employee'; 
          });
          setAccounts(employeeAccounts); // Update the state with the fetched accounts - filtered to only fetch the employee accounts
          console.log("Fetched accounts:", data);
        } catch (err) {
          console.error('Error fetching accounts:', err);
        }
      };

    fetchAccounts();
  }, []);
  

  // Function to fetch employee requests from the backend based on the selected Employee 
  useEffect(() => {
    const fetchRequests = async () => {
        try{
          const response = await fetch(`${BASE_URL}/requests`);

          if(!response.ok){
            throw new Error("Failed to fetch data");
          }

          const data = await response.json();
          const filteredData = data.filter(request => {
            if (request.requestType === "Time Off" || request.requestType === "Sick Day") {
              if (!selectedEmployee) {
                return true;
              }
              return request.accountId === selectedEmployee;
            }
            return false; 
          });
          
          setData(filteredData);
          setFilteredData(filteredData); // Initialize filteredData with the same data
          setAllRequests(filteredData);  // Store all requests for filtering
          console.log("Data: ", data);  
        } catch (error){
          console.error("Error fetching the data: ", error);
          setError("Failed to fetch request data");
          setLoading(false);
        }
      };

    fetchRequests();
  }, []);

  

  // Format date to be more readable
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  // Function to reset filter options
  const resetFilters = () => {
    setSelectedEmployee("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setFilteredData(allRequests);
  };

  // Apply filters to the data based on the selected options
  const applyFilters = () => {
    console.log("Filtering with criteria:", { selectedEmployee, startDate, endDate, status });
    const filtered = allRequests.filter(request => {
      // Filter by selected employee
      if (selectedEmployee && request.accountId !== parseInt(selectedEmployee)) {
        return false;
      }

      // Reference: OpenAI, "ChatGPT," Personal Communication, Mar. 2, 2025. Prompt: Please update the filter logic to make the date range inclusive.
      if (startDate || endDate) {
        const requestStartDate = new Date(request.startDate);
        const requestEndDate = new Date(request.endDate);
      
      // Filter start date 
      if (startDate) {
        const filterStartDate = new Date(startDate);
        if (requestEndDate < filterStartDate) {
          return false; // Request ends before filter start date
        }
      }
      
      // Filter end date
      if (endDate) {
        const filterEndDate = new Date(endDate);
        if (requestStartDate > filterEndDate) {
          return false; // Request starts after filter end date
        }
      }
    }

      // Filter by status
      if (status && request.status !== status) {
        return false;
      }

      return true;
  });

  setFilteredData(filtered);
  
};


  // [1]
  const chartData = {
    labels: ["Time-off", "Sick-day"],
    datasets: [
      {
        label: "Number of Requests",
        data: [10, 7], 
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Requests Report</h1>

      {/* Reference: OpenAI, "ChatGPT," Personal Communication, Feb. 26, 2025. Prompt: Format the following code for a horizontal layout */}
      {/* Filter Options */}
      <div className="bg-gray-100 p-2 rounded-lg">
        <h1 className="text-lg font-semibold mb-3">Filter</h1>
        
        <div className="flex flex-wrap gap-4">
          {/* Employee Filter */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700">Employee:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">-- Select Employee --</option>
              {accounts.map((account) => (
                <option key={account.accountId} value={account.accountId}>
                  {account.firstName} {account.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700">Start Date:</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700">End Date:</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700">Status:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">-- Select Status --</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="DECLINED">Declined</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex-1 min-w-[250px]">
            <button className="w-full bg-hover-blue hover:bg-main-blue text-white font-bold py-2 px-4 rounded"
              onClick={() => resetFilters()}>
              Reset
            </button>
          </div>

          {/* Filter Button */}
          <div className="flex-1 min-w-[250px]">
            <button className="w-full bg-hover-blue hover:bg-main-blue text-white font-bold py-2 px-4 rounded"
              onClick={() => applyFilters()}>
              Filter
            </button>
          </div>

        </div>
      </div>        

    {/* Reference: OpenAI, "ChatGPT," Personal Communication, Feb. 26, 2025. Prompt: Format the following code into a proper table. */}
    {/* Display the filtered report in a table */}
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">

        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium">Employee Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Employee ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Request Type</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Start Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium">End Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
          </tr>
        </thead>
        
        <tbody className="divide-y divide-gray-300">
          {filteredData.map((request, index) => {
            const employee = accounts.find(account => account.accountId === request.accountId);
            return (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 text-sm text-gray-700">
                  {employee ? `${employee.firstName} ${employee.lastName}` : "N/A"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{request.accountId}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{request.requestType}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{formatDate(request.startDate)}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{formatDate(request.endDate)}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{request.status}</td>
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>

    {/* Display the filtered report in a graph */}
    <Bar data={chartData} options={{ responsive: true }} />    
    
  </div>
  );
};

export default Reports;

