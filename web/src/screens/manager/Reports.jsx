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

  const fetchRequests = async () => {
    try{
      const response = await fetch("http://localhost:8080/api/requests");

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
    </div>
  );
};

export default Reports;

