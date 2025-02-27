import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

/**
 * [1] Code Complete. Learn React ChartJS in 8 Minutes | Complete Guide. (Sep. 24, 2023). Accessed: Feb. 24, 2025. [Online Video]. Available: https://www.youtube.com/watch?v=6q5d3Z1-5kQ&ab_channel=CodeComplete
 * [2] Chart.js (4.4.8.). "Configuration." Accessed: Feb. 24, 2025. [Online]. Available: https://www.chartjs.org/docs/4.4.8/configuration/
 * [3] Chart JS. Fetch and Display Advanced JSON Data in Chart JS. (Sep. 20, 2021). Accessed: Feb. 25, 2025. [Online Video]. Available: https://www.youtube.com/watch?v=mw5i_QGDomw
 */

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); 

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states 
  const [accounts, setAccounts] = useState([]); 
  

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
  


  const fetchRequests = async () => {
    try{
      const response = await fetch(`${BASE_URL}/requests`);

      if(!response.ok){
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log("Data: ", data);  
      setData(data);
      setLoading(false);
    } catch (error){
      console.error("Error fetching the data: ", error);
      setError("Failed to fetch request data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);
  
  const chartData = {
    labels: ["Time-off", "Vacation", "Sick-day"],
    datasets: [
      {
        label: "Number of Requests",
        data: [10, 15, 7], 
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Requests Report</h1>
      <Bar data={chartData} options={{ responsive: true }} />

      {/* Dropdown to select employee */} 
      <div className="mb-4">
          <h1 className="text-lg font-bold mb-4">Filter</h1>
        <select 
          className="w-full p-2 border border-gray-300 rounded"
          value={accounts.accountId}
          
          >
          <option value="">-- Select employee --</option>
          {accounts.map((account) => (
            <option key={account.accountId} value={account.accountId}>
              {account.firstName} {account.lastName}
            </option>
          ))}
        </select>
        </div>
    </div>
  );
};

export default Reports;

