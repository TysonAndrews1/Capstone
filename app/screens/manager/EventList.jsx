import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View, Platform, Image } from 'react-native';
import MainLayout from '../../layouts/MainLayout';  // Assuming you are using MainLayout for global styling
import EventBar from '../../components/EventBar';  // Assuming this component displays the events based on filter
import { useRouter, useNavigation } from 'expo-router';
import listIcon from "../../../assets/images/list.png"; // Icon from https://www.flaticon.com/free-icon/list_151917?term=list&page=1&position=1&origin=search&related_id=151917

export default function Events() {

  const [selectedOption, setSelectedOption] = useState('upcoming');  // Default to 'upcoming'
  const [events, setEvents] = useState([]); // State to store events from the backend
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const router = useRouter(); // Initialize the router
  const navigation = useNavigation(); // Navigation hook for screen transitions
  

  const BASE_URL = Platform.OS === 'android' ? ( 
    'http://10.0.2.2:8080/api/events') : //Android Device & Android Studio (Use your personal ipv4 address)
    'http://localhost:8080/api/events'; //Computer & iOS

  // Function to fetch events from the backend
  const fetchEvents = async (timeframe) => {
    
    setLoading(true); // Start loading indicator
    setError(true); // Reset error state

    try {
      const response = await fetch(`${BASE_URL}/filter?timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data); // Update the state with the fetched events
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events. Please try again later.');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Fetch events whenever the selected option changes
  useEffect(() => {
    fetchEvents(selectedOption);
  }, [selectedOption]);

  // Handle selection change
  const handleSelect = (option) => {
    setSelectedOption(option);
  };
  
  const CreateEvent = () =>{
    router.push('/screens/manager/CreateEvent')
  }

  useEffect(() => {
    navigation.setOptions({
        headerStyle: {
            backgroundColor: "#3F6D89",
        },
        headerTintColor: "#fff",
        headerRight: () => ( // This adds the "list.png" icon to the header. When clicked, it navigates to the EventList screen.
            <TouchableOpacity onPress={() => router.push("screens/manager/ManageEvents")}>
                <Image source={listIcon} style={styles.listIcon} />
            </TouchableOpacity>
        ),
    });
  }, [navigation, router]);

  return (
    <MainLayout>
      <View style={styles.container}>
        <View style={styles.optionsContainer}>
          {/* Past Events Option */}
          <TouchableOpacity onPress={() => handleSelect('past')}>
            <View style={[styles.option, selectedOption === 'past' && styles.selectedOption]}>
              <Text style={[styles.optionText, selectedOption === 'past' && styles.selectedText]}>
                Past Events
              </Text>
              {selectedOption === 'past' && <View style={styles.underline} />}
            </View>
          </TouchableOpacity>

          {/* Constant underline */}
          <View style={styles.constantUnderline} />

          {/* Upcoming Events Option */}
          <TouchableOpacity onPress={() => handleSelect('upcoming')}>
            <View style={[styles.option, selectedOption === 'upcoming' && styles.selectedOption]}>
              <Text style={[styles.optionText, selectedOption === 'upcoming' && styles.selectedText]}>
                Upcoming Events
              </Text>
              {selectedOption === 'upcoming' && <View style={styles.underline} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Scrollable Event List */}
        <ScrollView contentContainerStyle={styles.eventList}>
          <EventBar events={events} filterType={selectedOption} />
        </ScrollView> 

        {/* Create New Event Button */}
        <TouchableOpacity style={styles.button} onPress={CreateEvent} >
          <Text style={styles.buttonText}>Create New Event</Text>
        </TouchableOpacity>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  listIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
    marginRight: 8,
  },

  container: {
    flex: 1,
    justifyContent: 'flex-start',  // Align items at the top of the screen
    alignItems: 'center',
    padding: 10,
    paddingBottom: 80, // Ensure space for the button above the footer
  },

  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  option: {
    marginHorizontal: 20,
  },

  optionText: {
    fontSize: 18,
    fontWeight: 'normal',
  },

  selectedText: {
    fontWeight: 'bold', // Make text bold when selected
  },

  selectedOption: {
    paddingBottom: 5, // Add space for underline
  },

  underline: {
    height: 2,
    backgroundColor: '#3F6D89', // Underline color
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },

  constantUnderline: {
    height: 2,
    backgroundColor: '#3F6D89', // Constant underline color
    flex: 1,
    marginHorizontal: 10,
  },

  eventList: {
    flexGrow: 1,  // Allow the event list to grow and fill available space
    marginBottom: 20, // Space before the "Create New Event" button
  },

  button: {
    width: '90%',  // Button takes 90% of the screen width
    paddingVertical: 15,
    backgroundColor: '#E6F2Fa',  // Button background color
    borderRadius: 10,  // Slightly rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',  // Drop shadow color
    shadowOffset: { width: 0, height: 4 },  // Drop shadow offset
    shadowOpacity: 0.1,  // Drop shadow opacity
    shadowRadius: 6,  // Drop shadow radius
    elevation: 5,  // Elevation for Android (drop shadow effect)
    marginTop: 20,  // Added margin to separate from the options
  },

  buttonText: {
    fontSize: 16,  
    fontWeight: 'bold', 
    textAlign: 'center',
    color: '#3F6D89',  // Button text color
  },
});
