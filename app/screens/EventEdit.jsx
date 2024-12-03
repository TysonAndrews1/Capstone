import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, View, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MainLayout from '../layouts/MainLayout';  
import CalendarComponent from '../components/Calender';  // Your Calendar component
import { useRouter } from 'expo-router';

export default function CreateEvent(id) {
  // Track events (for the sake of this example, using a simple state)
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState(null); // Track which event (if any) is being edited
  const router = useRouter(); // Initialize the router

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
  
  const [showStartCalendar, setShowStartCalendar] = useState(false); // Calendar visibility
  const [showEndCalendar, setShowEndCalendar] = useState(false); // Calendar visibility
  
  // Handle date changes for time pickers (start and end time)
  const handleDateChange = (event, selectedDate, setTime, setShowPicker) => {
    const currentDate = selectedDate || startTime;
    setTime(currentDate);
    setShowPicker(false);
  };

  // Handle date selection for start date
  const handleStartChange = (selectedDate) => {
    setStartDate(selectedDate);
    setShowStartCalendar(false);  // Hide calendar after selection
  };

  // Handle date selection for end date
  const handleEndChange = (selectedDate) => {
    setEndDate(selectedDate);
    setShowEndCalendar(false);  // Hide calendar after selection
  };

  // Handle submit for creating or editing an event
  const handleSubmit = () => {
    if (!eventTitle || !startDate || !endDate || !startTime || !endTime || !location || !numberOfGuests || !eventManager) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    // Combine startDate with startTime and endDate with endTime into full Date objects
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());

    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());

    const newEvent = {
      eventName: eventTitle,
      eventStartDate: startDateTime,
      eventEndDate: endDateTime,
      eventLocation: location,
      numberOfGuests: parseInt(numberOfGuests),
      assignedManager: eventManager,
      specialRequirements: specialRequirements,
    };

    const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/events' : 'http://localhost:8080/api/events';

    // Use fetch to send the event data to the backend
    fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEvent),
    })
    .then((response) => response.json())
    .then((data) => {
      Alert.alert("Success", "Event created successfully!");
      router.push('/screens/EventList');
    })
    .catch((error) => {
      console.error('Error creating event:', error);
      Alert.alert("Error", "Failed to create event");
    });

    // If editing an existing event (eventId is set), update the event
    if (eventId) {
      const updatedEvents = events.map(event =>
        event.id === eventId ? newEvent : event
      );
      setEvents(updatedEvents);
      Alert.alert("Success", "Event updated successfully!");
    } else {
      // If creating a new event, add to the list of events
      setEvents(prevEvents => [...prevEvents, newEvent]);
      Alert.alert("Success", "Event created successfully!");
    }
    router.push(`/screens/EventList`);
  };

  // Edit an existing event
  const handleEditEvent = (id) => {
    const eventToEdit = events.find(event => event.id === id);
    if (eventToEdit) {
      setEventId(id);  // Set the eventId to the ID of the event being edited
      setEventTitle(eventToEdit.eventTitle);
      setStartTime(eventToEdit.startDateTime);
      setEndTime(eventToEdit.endDateTime);
      setStartDate(eventToEdit.startDateTime);
      setEndDate(eventToEdit.endDateTime);
      setLocation(eventToEdit.location);
      setNumberOfGuests(eventToEdit.numberOfGuests);
      setEventManager(eventToEdit.eventManager);
      setSpecialRequirements(eventToEdit.specialRequirements);
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
          <Text style={styles.submitButtonText}>Create/Update Event</Text>
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
