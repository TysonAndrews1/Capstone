import React, { useState, useEffect } from 'react';
import {ScrollView, Text, Pressable, StyleSheet, View, TextInput, Button, Platform } from 'react-native'
import MainLayout from '../layouts/MainLayout';
import DateTimePicker from '@react-native-community/datetimepicker';

const Events = () => {

  // State variables for user inputs
  const [eventName, setEventName] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [assignedManager, setAssignedManager] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  const BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/events' : 'http://localhost:8080/api/events';

  const handleSubmit = async () => {
    const eventData = {
      eventName,
      eventStartDate,
      eventEndDate,
      eventLocation,
      numberOfGuests: parseInt(numberOfGuests),
      assignedManager,
      specialRequirements,
    }

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (response.ok) {
      Alert.alert('Success', 'Event created successfully!');
    } else {
      Alert.alert('Error', 'Failed to create event. Please try again.');
    }
  } catch (error) {
    Alert.alert('Error', `An error occurred: ${error.message}`);
  }
};

return (
  <MainLayout>
    <View style={styles.form}>
      {/* Event Title */}
      <View style={styles.row}>
        <Text style={styles.label}>Event Title</Text>
        <TextInput style={styles.inputField} onChangeText={setEventName} value={eventName}/>
      </View>

      {/* Start Time */}
      <View style={styles.row}>
        <Text style={styles.label}>Start Time</Text>
        <TextInput style={styles.inputField} onChangeText={setEventStartDate} value = {eventStartDate} placeholder='YYYY-MM-DDThh:mm:ss'/>
      </View>

      {/* End Time */}
      <View style={styles.row}>
        <Text style={styles.label}>End Time</Text>
        <TextInput style={styles.inputField} onChangeText={setEventEndDate} value = {eventEndDate} placeholder='YYYY-MM-DDThh:mm:ss'/>
      </View>

      {/* Location */}
      <View style={styles.row}>
        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.inputField} onChangeText={setEventLocation} value={eventLocation}/>
      </View>

      {/* Number Of Guest */}
      <View style={styles.row}>
        <Text style={styles.label}>Number of Guests</Text>
        <TextInput style={styles.inputField} onChangeText={setNumberOfGuests} value={numberOfGuests} keyboardType='numeric'/>
      </View>

      {/* Event Manager */}
      <View style={styles.row}>
        <Text style={styles.label}>Event Manager</Text>
        <TextInput style={styles.inputField} onChangeText={setAssignedManager} value={assignedManager}/>
      </View>

      {/* Special Requirements */}
      <View style={styles.row}>
        <Text style={styles.label}>Special Requirements</Text>
        <TextInput style={styles.inputField} onChangeText={setSpecialRequirements} value={specialRequirements}/>
      </View>

      <Button title='Create Event' onPress={handleSubmit}></Button>
    </View>
  </MainLayout>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    flex: 1, // Adjusts label width
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputField: {
    flex: 2, // Adjusts input width
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default Events;