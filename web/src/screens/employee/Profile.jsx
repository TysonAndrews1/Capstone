import React, { useState, useEffect } from "react";
import { FaUserCircle, FaWrench } from "react-icons/fa";

/**
 * Created by: Michelle Tran 
 * This is the Profile screen where employees can view and edit their profile information
 * Reference: ChatGPT to help with the HandleInputChange function
 * 
 */
function Profile() {
  const [isEditing, setIsEditing] = useState(false); // This state allows users to edit their profile information; default is false
  const [employeeData, setEmployeeData] = useState({ // This is an object that contains the employee's data; the data provided are placeholders
    employee_id: "000000",
    first_name: "John",
    last_name: "Doe",
    phone_number: "111-111-1111",
    email_address: "JohnDoe@gmail.com",
  });
  const [availability, setAvailability] = useState([]); // This is an array that contains the employee's availability; the data provided are placeholders
  const [notifyShifts, setNotifyShifts] = useState(false); // This state allows employees to determine if they want to receive notification for their upcoming shifts
  const [fetchError, setFetchError] = useState(false); // This state is used to handle errors when fetching data from the API
  
  /**
   * This function fetches the employee data from the backend API when the component mounts.
   */
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Sends an HTTP GET request to the API to fetch the employee data
        const response = await fetch("http://localhost:8080/api/banquet_employees/000001");
        // Verifies the HTTP response status 
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEmployeeData(data); // If the fetch is successful, it updates the state with the fetched data
        setAvailability(["Monday: 9 AM - 5 PM", "Wednesday: 10 AM - 4 PM", "Friday: 8 AM - 2 PM"]); // Example data
        setFetchError(false);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setAvailability(["Monday: 8:00 AM - 5:00 PM", "Tuesday: 8:00 AM - 5:00 PM", "Friday: 8:00 AM - 2:00 PM"]); // Example data
        setFetchError(true); // If the fetch fails, it sets the fetchError state to true
      }
    };

    fetchEmployeeData();
  }, []);

  /**
   * this function sends updated employeeData to the backend using a PUT request and saves the response.
   */
  const handleSaveClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/banquet_employees/000001", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const updatedData = await response.json();
      setEmployeeData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving employee data:", error);
    }
  };

  /**
   * 
   * @param {*} e 
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-row min-h-screen">
      <div className="grid grid-cols-3 gap-20 w-full bg-white p-8 rounded-lg shadow-lg">

        {/* Column 1: Profile Information */}
        <div className="flex flex-col items-center space-y-4">
          <FaUserCircle className="text-gray-400" size={100} /> 
          <h2 className="text-xl font-bold text-gray-800">
            {employeeData.first_name || "First Name"} {employeeData.last_name || "Last Name"}
          </h2>
          {fetchError && (
            <p className="text-red-500 text-center">
              Unable to fetch employee data. Showing default or previously loaded values.
            </p>
          )}
          <div className="w-full">
            <p className="text-gray-700 font-medium">Employee ID:</p>
            <p className="text-gray-900">{employeeData.employee_id}</p>
          </div>
          {!isEditing ? (
            <>
              <div className="w-full">
                <p className="text-gray-700 font-medium">Phone:</p>
                <p className="text-gray-900">{employeeData.phone_number}</p>
              </div>
              <div className="w-full">
                <p className="text-gray-700 font-medium">Email:</p>
                <p className="text-gray-900">{employeeData.email_address}</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-full">
                <label className="text-gray-700 font-medium" htmlFor="phone_number">
                  Phone:
                </label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={employeeData.phone_number}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="w-full">
                <label className="text-gray-700 font-medium" htmlFor="email_address">
                  Email:
                </label>
                <input
                  type="email"
                  id="email_address"
                  name="email_address"
                  value={employeeData.email_address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </>
          )}
        </div>

        {/* Column 2: Availability */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Availability</h3>
          <ul className="space-y-2">
            {availability.length > 0 ? (
              availability.map((slot, index) => (
                <li key={index} className="p-2 border border-gray-300 rounded">
                  {slot}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No availability data available.</p>
            )}
          </ul>
        </div>

        {/* Column 3: Edit and Notifications */}
        <div className="flex flex-col ">
          {/* Edit Button */}
          <button
            type="button"
            className="flex items-center justify-center bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-hover-blue hover:text-white mb-4"
            onClick={() => setIsEditing(!isEditing)}
          >
            {!isEditing && <FaWrench className="mr-2" />}
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        

          {/* Save Button */}
          {isEditing && (
            <button
              type="button"
              className=" mt-2 bg-hover-blue text-white px-4 py-2 rounded hover:bg-main-blue"
              onClick={handleSaveClick}
            >
              Save Changes
            </button>
          )}

          {/* Notification Toggle */}
          <div className="flex items-center space-x-4 mt-4">
            <label className="text-gray-700 font-medium">Notify me on shifts:</label>
            <button
              type="button"
              className={`w-12 h-6 rounded-full flex items-center ${
                notifyShifts ? "bg-main-blue" : "bg-gray-300"
              }`}
              onClick={() => setNotifyShifts(!notifyShifts)}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                  notifyShifts ? "translate-x-6" : ""
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
