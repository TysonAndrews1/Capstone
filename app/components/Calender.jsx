import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const onDayPress = (day) => {
    const selected = day.dateString; // Format: 'YYYY-MM-DD'
    setSelectedDate(selected); // Update local state
  };

  return (
    <View style={styles.container}>
      {/* Calendar Component */}
      <View style={styles.calendarWrapper}>
      <Calendar
  current={new Date().toISOString().split('T')[0]}
  minDate={'2020-01-01'}
  maxDate={'2025-12-31'}
  onDayPress={onDayPress}
  markedDates={{
    [selectedDate]: {
      selected: true,
      selectedColor: '#FFB74D',
      selectedTextColor: '#fff',
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  calendarWrapper: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  calendar: {
    borderRadius: 10,
  },
});

export default CalendarComponent;
