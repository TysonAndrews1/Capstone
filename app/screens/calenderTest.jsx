import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import MainLayout from "../layouts/MainLayout";
import { Calendar } from "react-native-calendars";

const CalendarComponent = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const onDayPress = (day) => {
    const selected = day.dateString;
    setSelectedDate(selected);  // Update local state
    if (onDateSelect) {
      onDateSelect(selected);  // Pass the selected date to the parent via callback
    }
  };

  return (
    <MainLayout>
      <View style={styles.container}>
        <Text style={styles.selectedDateText}>
          Selected Date: {selectedDate || 'None'}
        </Text>

        <Calendar
          current={selectedDate || new Date().toISOString().split('T')[0]}
          minDate={'2020-01-01'}
          maxDate={'2025-12-31'}
          onDayPress={onDayPress}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'blue', selectedTextColor: 'white' }
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
    </MainLayout>
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
