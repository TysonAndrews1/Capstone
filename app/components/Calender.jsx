import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarComponent = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const onDayPress = (day) => {
    const selected = day.dateString;  // Get date in 'YYYY-MM-DD' format
    setSelectedDate(selected);  // Update local state

    // Convert the selected date string to a Date object using local time zone
    const [year, month, dayOfMonth] = selected.split('-');
    const dateObject = new Date(year, month - 1, dayOfMonth); // month is 0-based in JavaScript Date

    // Pass the Date object to the parent via callback
    if (onDateSelect) {
      onDateSelect(dateObject);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectedDateText}>
        Selected Date: {selectedDate || 'None'}
      </Text>

      <Calendar
        current={selectedDate || new Date().toISOString().split('T')[0]}
        minDate={'2020-01-01'}
        maxDate={'2026-12-31'}
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'orange', selectedTextColor: 'white' }
        }}
        theme={{
          selectedDayBackgroundColor: 'blue',
          todayTextColor: 'green',
          dayTextColor: 'black',
          arrowColor: 'orange',
          monthTextColor: 'purple',
          textDayFontWeight: 'bold',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textDayHeaderFontSize: 16,
          textMonthFontSize: 20,
        }}
      />

      {/* You can remove this Button or customize it */}
      <Button title="Select a Date" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDateText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default CalendarComponent;
