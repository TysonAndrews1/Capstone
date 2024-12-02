import React, { useState } from 'react';
import { ScrollView, Text, TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import MainLayout from '../layouts/MainLayout';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Events() {
  const [date, setDate] = useState(new Date());

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Event Title</Text>
        <TextInput style={styles.inputField} placeholder="Enter event title" />

        <Text style={styles.label}>Start Time</Text>


        <Text style={styles.label}>End Time</Text>


        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.inputField} placeholder="Enter location" />

        <Text style={styles.label}>Event Manager</Text>
        <TextInput style={styles.inputField} placeholder="Enter event manager" />

        <Text style={styles.label}>Special Requirements</Text>
        <TextInput style={styles.inputField} placeholder="Enter special requirements" />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  inputField: {
    width: '100%',
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  submitButton: {
    width: '90%',
    paddingVertical: 15,
    backgroundColor: '#3F6D89',  // Button background color
    borderRadius: 10,  // Slightly rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',  // Drop shadow color
    shadowOffset: { width: 0, height: 4 },  // Drop shadow offset
    shadowOpacity: 0.1,  // Drop shadow opacity
    shadowRadius: 6,  // Drop shadow radius
    elevation: 5,  // Elevation for Android (drop shadow effect)
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
