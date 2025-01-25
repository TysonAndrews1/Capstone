import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Platform, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useGlobalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

const AddShift = () => {
  const params = useGlobalSearchParams();
  const selectedDate = params?.date || '2000-01-01T00:00:00.000Z';
  const year = selectedDate.slice(0, 4);
  const month = selectedDate.slice(5, 7);
  const day = selectedDate.slice(8, 10);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = monthNames[parseInt(month, 10) - 1];

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [attachEventOpen, setAttachEventOpen] = useState(false);
  const [attachEventValue, setAttachEventValue] = useState(null);
  const [attachEventItems, setAttachEventItems] = useState([]);
  const [description, setDescription] = useState('');

  const EMPLOYEE_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api/employees'
    : 'http://localhost:8080/api/employees';
  const EVENTS_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api/events'
    : 'http://localhost:8080/api/events';

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(EMPLOYEE_URL);
        const employeeData = response.data.map(employee => ({
          label: `${employee.firstName} ${employee.lastName}`,
          value: employee.accountId,
        }));
        setItems(employeeData);
      } catch (error) {
        Alert.alert('Error', 'Failed to load employees. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch events for the selected date
  useEffect(() => {
    const fetchEvents = async () => {
      if (attachEventOpen) {
        try {
          const response = await axios.get(`${EVENTS_URL}?date=${selectedDate}`);
          console.log('API Response:', response.data);
    
          // Convert the selected date to UTC
          const selectedDateObject = new Date(selectedDate);
          const selectedDateUTC = Date.UTC(
            selectedDateObject.getUTCFullYear(),
            selectedDateObject.getUTCMonth(),
            selectedDateObject.getUTCDate()
          );
    
          const eventData = response.data
            .filter(event => {
              const startDate = new Date(event.eventStartDate);
              const endDate = new Date(event.eventEndDate);
    
              // Convert start and end dates to UTC
              const startDateUTC = Date.UTC(
                startDate.getUTCFullYear(),
                startDate.getUTCMonth(),
                startDate.getUTCDate()
              );
              const endDateUTC = Date.UTC(
                endDate.getUTCFullYear(),
                endDate.getUTCMonth(),
                endDate.getUTCDate()
              );
    
              // Compare with UTC
              console.log(
                `Event Name: ${event.eventName}, Start Date UTC: ${startDateUTC}, End Date UTC: ${endDateUTC}, Selected Date UTC: ${selectedDateUTC}`
              );
              return selectedDateUTC >= startDateUTC && selectedDateUTC <= endDateUTC;
            })
            .map(event => ({
              label: event.eventName,
              value: event.eventId,
              key: event.eventId.toString(),
            }));
    
          console.log('Filtered Events:', eventData);
          setAttachEventItems(eventData); // Set filtered data
        } catch (error) {
          console.error('Error fetching events:', error);
          Alert.alert('Error', 'Failed to load events for the selected date.');
        }
      }
    };
    
    
    
    
    fetchEvents();
  }, [attachEventOpen, selectedDate]);

  const handleSave = () => {
    console.log('Attach Event:', attachEventValue);
    console.log('Selected Employees:', value);
    console.log('Description:', description);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const selectedLabels = items.filter(item => value.includes(item.value)).map(item => item.label);

  
  return (
    <MainLayout>
      <View style={styles.container}>
        {/* Date */}
        <Text style={styles.dateText}>{monthName} {day}, {year}</Text>

        {/* DropDownPicker */}
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          multiple={true}
          listMode="SCROLLVIEW"
          placeholder="Select Employee(s)"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          arrowIconStyle={{ width: 20, height: 20 }}
          showArrowIcon={true}
        />

        {/* Selected Employee Names */}
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedText}>
            {selectedLabels.length > 0 ? selectedLabels.join(', ') : 'No employees selected'}
          </Text>
        </View>

        {/* Start Time */}
        <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.inputWrapper}>
          <Text style={styles.inputField}>
            {startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Start Time'}
          </Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime || new Date()}
            mode="time"
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) setStartTime(selectedDate);
              setShowStartTimePicker(false);
            }}
          />
        )}

        {/* End Time */}
        <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.inputWrapper}>
          <Text style={styles.inputField}>
            {endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'End Time'}
          </Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime || new Date()}
            mode="time"
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) setEndTime(selectedDate);
              setShowEndTimePicker(false);
            }}
          />
        )}

        {/* Attach Event */}
        <DropDownPicker
          open={attachEventOpen}
          value={attachEventValue}
          items={attachEventItems}
          setOpen={setAttachEventOpen}
          setValue={setAttachEventValue}
          listMode="SCROLLVIEW"
          placeholder="Attach Event"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholderStyle={{ color: 'red' }}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={10}
          placeholder="Enter description here"
          value={description}
          onChangeText={setDescription}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdown: {
    backgroundColor: '#E6F2FA',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    marginBottom: 15,
  },
  dropdownContainer: {
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  selectedContainer: {
    backgroundColor: '#E6F2FA',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    justifyContent: 'center',
    height: 40,
  },
  selectedText: {
    fontSize: 14,
    color: '#333',
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputField: {
    padding: 10,
    backgroundColor: '#E6F2FA',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    color: 'red',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#E6F2FA',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AddShift;
