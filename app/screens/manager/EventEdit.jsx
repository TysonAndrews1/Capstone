import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, View, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MainLayout from '../../layouts/MainLayout';  
import CalendarComponent from '../../components/Calender';  // Calendar Component
import { useRouter } from 'expo-router';

export default function CreateEvent() {
  const [eventTitle, setEventTitle] = useState('');
  const [startDate, setStartDate] = useState(null); // UTC 날짜
  const [endDate, setEndDate] = useState(null); // UTC 날짜
  const [startTime, setStartTime] = useState(new Date()); // 시간 관리
  const [endTime, setEndTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [eventManager, setEventManager] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  const [showStartCalendar, setShowStartCalendar] = useState(false); // Start Date 캘린더
  const [showEndCalendar, setShowEndCalendar] = useState(false); // End Date 캘린더
  const [showStartTimePicker, setShowStartTimePicker] = useState(false); // Start Time 선택
  const [showEndTimePicker, setShowEndTimePicker] = useState(false); // End Time 선택

  const router = useRouter();

  // 날짜와 시간을 결합하는 함수 (UTC 기준)
  const combineDateAndTime = (date, time) => {
    const combined = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );
    console.log("Combined DateTime (UTC):", combined.toISOString()); // 디버깅
    return combined;
  };

  // 이벤트 제출 처리
  const handleSubmit = () => {
    if (!eventTitle || !startDate || !endDate || !startTime || !endTime || !location || !numberOfGuests || !eventManager) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    const startDateTime = combineDateAndTime(startDate, startTime); // 시작 날짜와 시간 결합
    const endDateTime = combineDateAndTime(endDate, endTime); // 종료 날짜와 시간 결합

    const newEvent = {
      eventName: eventTitle,
      eventStartDate: startDateTime.toISOString(), // UTC 시간으로 저장
      eventEndDate: endDateTime.toISOString(),
      eventLocation: location,
      numberOfGuests: parseInt(numberOfGuests, 10),
      assignedManager: eventManager,
      specialRequirements: specialRequirements,
    };

    const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/events' : 'http://localhost:8080/api/events';

    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then(() => {
        Alert.alert("Success", "Event created successfully!");
        router.push('/screens/manager/EventList');
      })
      .catch((error) => {
        console.error('Error creating event:', error);
        Alert.alert("Error", "Failed to create event");
      });
  };

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Event Title</Text>
        <TextInput
          style={styles.inputField}
          value={eventTitle}
          onChangeText={setEventTitle}
          placeholder="Enter event title"
        />

        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity onPress={() => setShowStartCalendar(!showStartCalendar)}>
          <Text style={styles.inputField}>
            {startDate ? startDate.toISOString().split("T")[0] : "Select Start Date"}
          </Text>
        </TouchableOpacity>
        {showStartCalendar && (
          <CalendarComponent
            onDateSelect={(date) => {
              console.log("Selected Start Date (UTC):", date);
              setStartDate(date);
              setShowStartCalendar(false);
            }}
          />
        )}

        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
          <Text style={styles.inputField}>
            {startTime ? startTime.toLocaleTimeString() : "Select Start Time"}
          </Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) setStartTime(selectedDate);
              setShowStartTimePicker(false);
            }}
          />
        )}

        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity onPress={() => setShowEndCalendar(!showEndCalendar)}>
          <Text style={styles.inputField}>
            {endDate ? endDate.toISOString().split("T")[0] : "Select End Date"}
          </Text>
        </TouchableOpacity>
        {showEndCalendar && (
          <CalendarComponent
            onDateSelect={(date) => {
              console.log("Selected End Date (UTC):", date);
              setEndDate(date);
              setShowEndCalendar(false);
            }}
          />
        )}

        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
          <Text style={styles.inputField}>
            {endTime ? endTime.toLocaleTimeString() : "Select End Time"}
          </Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) setEndTime(selectedDate);
              setShowEndTimePicker(false);
            }}
          />
        )}

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.inputField}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
        />

        <Text style={styles.label}>Number of Guests</Text>
        <TextInput
          style={styles.inputField}
          value={numberOfGuests}
          onChangeText={setNumberOfGuests}
          placeholder="Enter number of guests"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Event Manager</Text>
        <TextInput
          style={styles.inputField}
          value={eventManager}
          onChangeText={setEventManager}
          placeholder="Enter event manager"
        />

        <Text style={styles.label}>Special Requirements</Text>
        <TextInput
          style={styles.inputField}
          value={specialRequirements}
          onChangeText={setSpecialRequirements}
          placeholder="Enter special requirements"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  form: { padding: 20, paddingBottom: 80 },
  label: { fontSize: 16, marginBottom: 8, fontWeight: 'bold' },
  inputField: {
    height: 40,
    borderColor: '#3F6D89',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#3F6D89',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
