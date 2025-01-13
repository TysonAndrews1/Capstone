import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, View, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MainLayout from '../layouts/MainLayout';  
import CalendarComponent from '../components/Calender';  // Your Calendar component
import { useRouter, useSearchParams } from 'expo-router';

export default function EditEvent() {
  const [eventTitle, setEventTitle] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [eventManager, setEventManager] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  
  const router = useRouter();
  const { id } = useSearchParams(); 

  const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/events' : 'http://localhost:8080/api/events';

  const fetchEventData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch event data');
      const data = await response.json();

      // Fills in the event data in the form fields
      setEventTitle(data.eventName);
      setStartDate(new Date(data.eventStartDate));
      setEndDate(new Date(data.eventEndDate));
      setStartTime(new Date(data.eventStartDate));
      setEndTime(new Date(data.eventEndDate));
      setLocation(data.eventLocation);
      setNumberOfGuests(data.numberOfGuests.toString());
      setEventManager(data.assignedManager);
      setSpecialRequirements(data.specialRequirements);
    } catch (error) {
      console.error('Error fetching event data:', error);
      Alert.alert("Error", "Failed to load event data.");
    }
  };

  useEffect(() => {
    if (id) fetchEventData(); 
  }, [id]);

  const handleSubmit = async () => {
    // Validate fields
    if (!eventTitle || !startDate || !endDate) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const startDateTime = new Date(startDate);
    startDateTime.setHours(startTime.getHours(), startTime.getMinutes());

    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.getHours(), endTime.getMinutes());

    const updatedEvent = {
      eventName: eventTitle,
      eventStartDate: startDateTime,
      eventEndDate: endDateTime,
      eventLocation: location,
      numberOfGuests: parseInt(numberOfGuests),
      assignedManager: eventManager,
      specialRequirements: specialRequirements,
    };

    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) throw new Error('Failed to update event');
      Alert.alert("Success", "Event updated successfully!");
      router.push('/screens/EventList');
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert("Error", "Failed to update event.");
    }
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
            {startDate ? startDate.toLocaleDateString() : 'Select Start Date'}
          </Text>
        </TouchableOpacity>

        {/* Show Calendar for start date if showStartCalendar is true */}
        {showStartCalendar && (
          <CalendarComponent onDateSelect={handleStartChange} />
        )}

        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
          <Text style={styles.inputField}>
            {startTime ? startTime.toLocaleTimeString() : 'Select Start Time'}
          </Text>
        </TouchableOpacity>

        {/* Show DateTimePicker for start time if showStartTimePicker is true */}
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="spinner"
            onChange={(event, selectedDate) =>
              handleDateChange(event, selectedDate, setStartTime, setShowStartTimePicker)
            }
          />
        )}

        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity onPress={() => setShowEndCalendar(!showEndCalendar)}>
          <Text style={styles.inputField}>
            {endDate ? endDate.toLocaleDateString() : 'Select End Date'}
          </Text>
        </TouchableOpacity>

        {/* Show Calendar for end date if showEndCalendar is true */}
        {showEndCalendar && (
          <CalendarComponent onDateSelect={handleEndChange} />
        )}

        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
          <Text style={styles.inputField}>
            {endTime ? endTime.toLocaleTimeString() : 'Select End Time'}
          </Text>
        </TouchableOpacity>

        {/* Show DateTimePicker for end time if showEndTimePicker is true */}
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="spinner"
            onChange={(event, selectedDate) =>
              handleDateChange(event, selectedDate, setEndTime, setShowEndTimePicker)
            }
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
          keyboardType='numeric'
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

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{id ? 'Update Event' : 'Create Event'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 20,
    paddingBottom: 80, // Ensure space for the button above the footer
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  inputField: {
    height: 40,
    borderColor: '#3F6D89',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius:10,
    textAlign:"center"
  },
  submitButton: {
    backgroundColor: '#3F6D89',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight:20,
  }
})
