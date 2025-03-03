import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * References:
 * [1] Code Complete. Learn React ChartJS in 8 Minutes | Complete Guide. (Sep. 24, 2023). Accessed: Feb. 24, 2025. [Online Video]. Available: https://www.youtube.com/watch?v=6q5d3Z1-5kQ&ab_channel=CodeComplete
 * [2] Chart.js (4.4.8.). "Step-by-step guide." Accessed: Feb. 24, 2025. [Online]. Available: https://www.chartjs.org/docs/latest/getting-started/usage.html
 * [3] Chart JS. Fetch and Display Advanced JSON Data in Chart JS. (Sep. 20, 2021). Accessed: Feb. 25, 2025. [Online Video]. Available: https://www.youtube.com/watch?v=mw5i_QGDomw
 * [4] Aalam Info Solutions LLP. "Creating Dynamic PDFs with JsPDF and Customizing AutoTables in React." Accessed: Mar. 3, 2025 [Online]. Available: https://medium.com/@aalam-info-solutions-llp/creating-dynamic-pdfs-with-jspdf-and-customizing-autotables-in-react-a846a6f3fdca
 * [5] npm. "jsPDF-AutoTable-Table plugin for jsPDF." Accessed: Mar. 3, 2025 [Online]. Available: https://www.npmjs.com/package/jspdf-autotable
 */

/**
 * [2]
 * Register Chart.js components
 */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
        const employeeAccounts = data.filter(function (account) {
          return account.role === "Employee";
        });
        setAccounts(employeeAccounts); // Update the state with the fetched accounts - filtered to only fetch the employee accounts
        console.log("Fetched accounts:", data);
      } catch (err) {
        console.error("Error fetching accounts:", err);
      }
    };

    fetchAccounts();
  }, []);

  // Function to fetch employee requests from the backend based on the selected Employee
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${BASE_URL}/requests`);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        const filteredData = data.filter((request) => {
          if (
            request.requestType === "Time Off" ||
            request.requestType === "Sick Day"
          ) {
            if (!selectedEmployee) {
              return true; // If no employee is selected, return all requests
            }
            return request.accountId === selectedEmployee; // Requests that match the selected employee's ID
          }
          return false;
        });

        setData(filteredData);
        setFilteredData(filteredData); // Used to store the filtered data
        setAllRequests(filteredData); // Store all requests for filtering
        console.log("Data: ", data); // Check to see if the data was fetched 
      } catch (error) {
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

  /**
   *
   * [1], [2], [3]
   *
   */
  const generateChartData = () => {
    // Calculate counts for each request type
    const timeOffCount = filteredData.filter(
      (req) => req.requestType === "Time Off"
    ).length;
    const sickDayCount = filteredData.filter(
      (req) => req.requestType === "Sick Day"
    ).length;
    const pendingCount = filteredData.filter(
      (req) => req.status === "PENDING"
    ).length;

    return {
      labels: ["Time-off", "Sick-day"],
      datasets: [
        {
          label: "Number of Requests",
          data: [timeOffCount, sickDayCount],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Pending",
          data: [pendingCount, pendingCount],
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,

        }
      ],
    };
  };

  // Apply filters to the data based on the selected options
  const applyFilters = () => {
    console.log("Filtering with criteria:", {
      selectedEmployee,
      startDate,
      endDate,
      status,
    });
    const filtered = allRequests.filter((request) => {
      // Filter by selected employee
      if (
        selectedEmployee &&
        request.accountId !== parseInt(selectedEmployee)
      ) {
        return false;
      }

      // Reference: OpenAI, "ChatGPT," Personal Communication, Mar. 2, 2025. Prompt: How do I update the filter logic to make the date range inclusive?
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

  // Function to reset filter options
  const resetFilters = () => {
    setSelectedEmployee("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setFilteredData(allRequests);
  };

  /**
   * [4]
   * Prompt: "Please help me resolve 'ERROR pdf.autoTable is not a function'."
   */
  const downloadPDF = () => {
    // Create a new jsPDF instance
    const pdf = new jsPDF();

    // Add title
    pdf.setProperties({
      title: "Time Off Requests Report",
    });

    // Add text to the PDF
    pdf.setFontSize(18);
    pdf.setFont("bold");
    pdf.text("Time Off Requests Report", 14, 22);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Create table data
    const tableColumn = [
      "Employee Name",
      "Employee ID",
      "Request Type",
      "Start Date",
      "End Date",
      "Status",
    ];
    const tableRows = [];

    filteredData.forEach((request) => {
      const employee = accounts.find(
        (account) => account.accountId === request.accountId
      );
      const employeeName = employee
        ? `${employee.firstName} ${employee.lastName}`
        : "N/A";

      tableRows.push([
        employeeName,
        request.accountId,
        request.requestType,
        formatDate(request.startDate),
        formatDate(request.endDate),
        request.status,
      ]);
    });

    // Generate the table
    autoTable(pdf, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [75, 192, 192],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: 35 },
    });

    /**
     * [5]
     * Add chart summary to PDF
     */
    const finalY = pdf.lastAutoTable ? pdf.lastAutoTable.finalY : 100;
    const timeOffCount = filteredData.filter(
      (req) => req.requestType === "Time Off"
    ).length;
    const sickDayCount = filteredData.filter(
      (req) => req.requestType === "Sick Day"
    ).length;

    pdf.setFontSize(14);
    pdf.text("Request Summary", 14, finalY + 20);
    pdf.setFontSize(11);
    pdf.text(`Time Off Requests: ${timeOffCount}`, 14, finalY + 30);
    pdf.text(`Sick Day Requests: ${sickDayCount}`, 14, finalY + 38);
    pdf.text(`Total Requests: ${filteredData.length}`, 14, finalY + 46);

    // Save the PDF
    pdf.save("requests-report.pdf");
  };



  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Requests Report</h1>

      {/* Button to download the filtered data as PDF */}
      <button
        className="bg-main-blue hover:bg-hover-blue text-white font-bold py-2 px-4 rounded mb-4"
        onClick={downloadPDF}
      >
        Download PDF Report
      </button>

      {/* Reference: OpenAI, "ChatGPT," Personal Communication, Feb. 26, 2025. Prompt: Format the following code for a horizontal layout */}
      {/* Filter Options */}
      <div className="bg-gray-100 p-2 rounded-lg">
        <h1 className="text-lg font-semibold mb-3">Filter</h1>

        <div className="flex flex-wrap gap-4">
          {/* Employee Filter */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700">
              Employee:
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Start Date:
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700">
              End Date:
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700">
              Status:
            </label>
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
            <button
              className="w-full bg-hover-blue hover:bg-main-blue text-white font-bold py-2 px-4 rounded"
              onClick={() => resetFilters()}
            >
              Reset
            </button>
          </div>

          {/* Filter Button */}
          <div className="flex-1 min-w-[250px]">
            <button
              className="w-full bg-hover-blue hover:bg-main-blue text-white font-bold py-2 px-4 rounded"
              onClick={() => applyFilters()}
            >
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
              <th className="px-4 py-2 text-left text-sm font-medium">
                Employee Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                Employee ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                Request Type
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                Start Date
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                End Date
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {filteredData.map((request, index) => {
              const employee = accounts.find(
                (account) => account.accountId === request.accountId
              );
              return (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {employee
                      ? `${employee.firstName} ${employee.lastName}`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {request.accountId}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {request.requestType}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {formatDate(request.startDate)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {formatDate(request.endDate)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {request.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Chart UI */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Employee Request Chart</h2>
        <Bar
          data={generateChartData()}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Request Types",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Reports;
