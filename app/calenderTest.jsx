import React, {useState} from "react";
import { StyleSheet,View, Text, Button } from "react-native";
import MainLayout from "./layouts/MainLayout";
import { Calendar } from "react-native-calendars";

export default function calenderTest({ navigation, route }) {
    const [selectedDate, setSelectedDate] = useState('');
    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
      };
  return (
      <MainLayout>



<View style={styles.container}>
      <Text style={styles.selectedDateText}>
        Selected Date: {selectedDate || 'None'}
      </Text>

      <Calendar
        // Initially selected date
        current={selectedDate || new Date().toISOString().split('T')[0]} 
        minDate={'2020-01-01'}
        maxDate={'2025-12-31'}
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'blue', selectedTextColor: 'white' }
        }}
        // Custom header styling
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

      <Button title="Select a Date" onPress={() => {}} />
        </View>
      </MainLayout>
    
  )}
  
  const styles = StyleSheet.create({
    form:{
  
  
    },
    label:{
  
    },
    inputField:{
  
    }
  });