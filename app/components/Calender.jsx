import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";

/**
 * Custom Calendar Component
 * Allows users to select a date, with the ability to toggle the selection on/off.
 * @param {function} onDateSelect - Callback function to pass the selected date to the parent component. 
 * @returns 
 */
const CalendarComponent = ({ onDateSelect }) => {

  // Tracks the currently selected date
  const [selectedDate, setSelectedDate] = useState(null);

  /**
   * Handles the logic for date selection and deselection.
   * @param {object} day - Object containing information about the selected date (e.g., dateString). 
   */
  const onDayPress = (day) => {
    const selected = new Date(day.dateString); 

    if (selectedDate && selectedDate.toISOString() === selected.toISOString()) {
      // If the same date is selected again, deselect it
      setSelectedDate(null);
      onDateSelect(null); // Notify parent component of deselection
    } else {
      // Select a new date
      setSelectedDate(selected);
      onDateSelect(selected); // Pass the selected date (in UTC) to the parent component
    }
  };

  return (
    <View style={styles.calendarWrapper}>
      <Calendar
        current={new Date().toISOString().split('T')[0]}
        minDate={'2020-01-01'}
        maxDate={'2030-12-31'}
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate?.toISOString().split("T")[0]]: {
            selected: true,
            selectedColor: "#FFB74D",
            selectedTextColor: "#fff",
          },
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#f9f9f9',
          textSectionTitleColor: '#000',
          selectedDayBackgroundColor: '#FFB74D',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#000',
          dayTextColor: '#2d4150',
          arrowColor: '#3F6D89',
          monthTextColor: '#000',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textDayFontSize: 14,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 16,
          'stylesheet.calendar.header': {
            dayTextAtIndex0: { width: '14%', textAlign: 'center' }, // Sunday
            dayTextAtIndex1: { width: '14%', textAlign: 'center' }, // Monday
            dayTextAtIndex2: { width: '14%', textAlign: 'center' }, // Tuesday
            dayTextAtIndex3: { width: '14%', textAlign: 'center' }, // Wednesday
            dayTextAtIndex4: { width: '14%', textAlign: 'center' }, // Thursday
            dayTextAtIndex5: { width: '14%', textAlign: 'center' }, // Friday
            dayTextAtIndex6: { width: '14%', textAlign: 'center' }, // Saturday
          },
        }}
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarWrapper: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignSelf: 'center',
  },
  calendar: {
    borderRadius: 10,
  },
});

export default CalendarComponent;
