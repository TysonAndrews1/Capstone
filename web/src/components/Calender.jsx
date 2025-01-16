// src/components/CalendarComponent.js
import React, { useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Required for base Calendar styling

/**
 * Custom Calendar Component
 * Allows users to select a date, with the ability to toggle the selection on/off.
 * @param {function} onDateSelect - Callback function to pass the selected date to the parent component. 
 * @returns 
 */
const CalendarComponent = ({ onDateSelect }) => {
  // Tracks the currently selected date
  const [selectedDate, setSelectedDate] = useState(Date.now());

  /**
   * Handles the logic for date selection and deselection.
   * @param {Date} value - The selected date.
   */
  const onDayPress = (value) => {
    if (selectedDate && selectedDate.toString() === value.toString()) {
      // If the same date is selected again, deselect it
      setSelectedDate(null);
      onDateSelect(null); // Notify parent component of deselection
    } else {
      // Select a new date
      setSelectedDate(value);
      onDateSelect(value); // Pass the selected date to the parent component
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-4">
        <Calendar
          onChange={onDayPress}
          value={selectedDate}
          minDate={new Date("2020-01-01")}
          maxDate={new Date("2030-12-31")}
          tileClassName={({ date, view }) => {
            // Highlight selected date
            const isSelected =
              selectedDate && selectedDate.toString().split("T")[0] === date.toString().split("T")[0];
            return isSelected
              ? "bg-orange-400 text-white rounded-full"
              : "hover:bg-gray-100";
          }}
          className="rounded-md border border-gray-300"
          calendarType="US"
        />
      </div>
    </div>
  );
};

export default CalendarComponent;
