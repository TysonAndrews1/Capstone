import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MainLayout from '../../layouts/MainLayout';  
import CalendarComponent from '../../components/Calender';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditEvent() {
  // States for managing event details
  const [eventId, setEventId] = useState(null); // To store the eventId
  const [eventTitle, setEventTitle] = useState(''); // Event title
  const [startDate, setStartDate] = useState(null); // Event start date (UTC)
  const [endDate, setEndDate] = useState(null); // Event end date (UTC)
  const [startTime, setStartTime] = useState(new Date()); // Event start time
  const [endTime, setEndTime] = useState(new Date()); // Event end time
  const [location, setLocation] = useState(''); // Event location
  const [numberOfGuests, setNumberOfGuests] = useState(''); // Number of expected guests
  const [eventManager, setEventManager] = useState(''); // Name of the manager who is in charge
  const [specialRequirements, setSpecialRequirements] = useState(''); // Additional event requirement

  const navigation = useNavigation(); // Navigation hook for screen transitions
  const router = useRouter(); // Navigation hook for screen transitions

   // API base URL, adjusted for platform
  const BASE_URL = Platform.OS === 'android' ? ( 'http://10.0.2.2/api/events') : 'http://localhost:8080/api/events';

  // States for managing UI elements
  const [showStartCalendar, setShowStartCalendar] = useState(false); // Toggles start date calendar
  const [showEndCalendar, setShowEndCalendar] = useState(false); // Toggles end date calendar
  const [showStartTimePicker, setShowStartTimePicker] = useState(false); // Toggles start time picker
  const [showEndTimePicker, setShowEndTimePicker] = useState(false); // Toggles end time picker

  useEffect(() => {
    const fetchEventIdAndData = async () => { // Method to fetch the event ID
      try {
        const storedEventId = await AsyncStorage.getItem('selectedEventId');
        if (storedEventId) {
          setEventId(storedEventId);
          fetchEventDetails(storedEventId);
        } else {
          Alert.alert('Error', 'No event ID found in storage.');
        }
      } catch (error) {
        console.error('Error fetching event ID from AsyncStorage:', error);
        Alert.alert('Error', 'Failed to retrieve event ID.');
      }
    };
    
    fetchEventIdAndData();
  }, []);

  const fetchEventDetails = async (id) => { // Method to fetch the event details 
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch event details: ${response.status}`);
      }
      const data = await response.json();
      setEventTitle(data.eventName);
      setStartDate(new Date(data.eventStartDate));
      setEndDate(new Date(data.eventEndDate));
      setStartTime(new Date(data.eventStartDate));
      setEndTime(new Date(data.eventEndDate));
      setLocation(data.eventLocation);
      setNumberOfGuests(data.numberOfGuests.toString());
      setEventManager(data.assignedManager);
      setSpecialRequirements(data.specialRequirements || '');
    } catch (error) {
      console.error('Error fetching event details:', error);
      Alert.alert('Error', 'Failed to load event details.');
    }
  };

  const combineDateAndTime = (date, time) => {
    // Convert Local Time to UTC time zone
    const combined = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
      )
    );
    return combined; // Return the UTC data
  };

  const handleSubmit = async () => { // Method to update the event
    if (!eventTitle || !startDate || !endDate || !startTime || !endTime || !location || !numberOfGuests || !eventManager) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }
  
    // Convert to UTC time
    const startDateTime = combineDateAndTime(startDate, startTime); 
    const endDateTime = combineDateAndTime(endDate, endTime);    
  
    // Create the object to send to the server
    const updatedEvent = {
      eventName: eventTitle,
      eventStartDate: startDateTime.toISOString(), // ISO 8601 format (UTC)
      eventEndDate: endDateTime.toISOString(),     // ISO 8601 format (UTC)
      eventLocation: location,
      numberOfGuests: parseInt(numberOfGuests, 10),
      assignedManager: eventManager,
      specialRequirements,
    };
    
    console.log('Final Event Data (to be sent to server):', updatedEvent); // This sends a message to the console with the updated event data

    try {
      const response = await fetch(`${BASE_URL}/${eventId}`, { // Update the event using the PUT method
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.status}`);
      }

      Alert.alert('Success', 'Event updated successfully!');
      router.push('/screens/manager/EventList');
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'Failed to update event');
    }
  };

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.form}>
        
        {/* Input for Event Title */}
        <Text style={styles.label}>Event Title</Text>
        <TextInput
          style={styles.inputField}
          value={eventTitle}
          onChangeText={setEventTitle}
          placeholder="Enter event title"
        />

        {/* Input for Start Date */}
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

        {/* Input for Start Time */}
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

        {/* Input for End Date */}
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

        {/* Input for End Time */}
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

        {/* Input for Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.inputField}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
        />

        {/* Input for Number of Guests */}
        <Text style={styles.label}>Number of Guests</Text>
        <TextInput
          style={styles.inputField}
          value={numberOfGuests}
          onChangeText={setNumberOfGuests}
          placeholder="Enter number of guests"
          keyboardType="numeric"
        />

        {/* Input for Name of the Manager */}
        <Text style={styles.label}>Event Manager</Text>
        <TextInput
          style={styles.inputField}
          value={eventManager}
          onChangeText={setEventManager}
          placeholder="Enter event manager"
        />

        {/* Input for Special Requirements */}
        <Text style={styles.label}>Special Requirements</Text>
        <TextInput
          style={styles.inputField}
          value={specialRequirements}
          onChangeText={setSpecialRequirements}
          placeholder="Enter special requirements"
        />

        {/* Submit button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 20,
    paddingBottom: 80,
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

  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});