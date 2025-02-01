import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import BottomSheetModal from "../../components/BottomSheetModal";
import BaseURLConfig from "../../config/BaseURLConfig";


const BASE_URL = BaseURLConfig();

const EmployeeScreen = () => {
  const [user, setUser] = useState(null); // State for user data
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for managing the currently selected date
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek()); // State for storing the current week's dates
  const [events, setEvents] = useState([]); // State for storing events fetched from the backend
  const [loading, setLoading] = useState(false); // State for handling Loading
  const [error, setError] = useState(null); // State for handling errors
  const [shifts, setShifts] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalHeight, setModalHeight] = useState(300);

  // Helper function to calculate the current week's dates
  function getCurrentWeek() {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }

  // Fetch user data from MySQL using Firebase Authentication email
  useEffect(() => {
    const fetchUserData = async (email) => {
      try {
        const response = await fetch(`${BASE_URL}/accounts/user?email=${email}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUser(data); // Set user data from MySQL
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data. Please try again.");
      }
    };

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.email); // Fetch user data using email
      } else {
        setUser(null); // Clear user data if no user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Fetch events from the backend whenever the selected date changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`${BASE_URL}/events?date=${formattedDate}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [selectedDate]);

  /**
   * This code was generated with assistance from chatGPT.
   * Prompt: Write a React Native code using useEffect to fetch data based on a specific user's accountId
   * and a selected date. The API URL should follow the format /shifts/{accountId}?date={formattedDate}.
   * Include error handling and loading state in the implementation.
   */
  useEffect(() => {
    const fetchShifts = async () => {
      if (!user || !user.accountId) return;
  
      setLoading(true);
      setError(null);

      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`${BASE_URL}/shifts/account/${user.accountId}?date=${formattedDate}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setShifts(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error('Error fetching shifts:', err);
        setError('Failed to fetch shifts. Please try again.');
        setShifts([]); 
      } finally {
        setLoading(false);
      }
    };
  
    fetchShifts();
  }, [selectedDate, user]);

  // Fetch the shifts with selected date
  // This code was generated with assistance from chatGPT
  // Prompt: I want to 
  const fetchShiftsForSelectedDate = async () => {
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(`${BASE_URL}/shifts?date=${formattedDate}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // ✅ 날짜가 일치하는 쉬프트만 필터링
      const filteredShifts = data.filter((shift) => {
        const shiftDate = parseISO(shift.startTime); // 날짜 변환
        return isSameDay(shiftDate, selectedDate);
      });

      setShifts(filteredShifts);
    } catch (err) {
      console.error('Error fetching shifts:', err);
      setShifts([]);
    }
  };

  // Open Modal
  const openModal = async () => {
    await fetchShiftsForSelectedDate();
    setModalVisible(true);
  };
  // Helper function to display a greeting based on the time of day
  const getTimeOfDayMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  // Filter events to show only those happening on the selected date
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.eventStartDate);
    return isSameDay(eventDate, selectedDate);
  });

  const filteredShifts = shifts.filter((shift) => {
    const shiftDate = new Date(shift.shiftStartDate);
    return isSameDay(shiftDate, selectedDate);
  });

  return (
    <MainLayout>
      <View style={styles.container}>
        {/* Greeting for the user */}
        <Text style={styles.greeting}>{getTimeOfDayMessage()},</Text>
        <Text style={styles.name}>
          {user ? `${user.firstName}` : "Loading..."}
        </Text>

        {/* User Information Card */}
        <View style={{ ...styles.card, backgroundColor: '#212124' }}>
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>
              {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </Text>
            <Text style={styles.cardSubtitle}>
              {user ? `${user.role}` : "Loading..."}
            </Text>
            <Text style={styles.cardText}>
              It's gonna be announcements.
            </Text>
          </View>
        </View>

        {/* four buttons */}
        <View style={styles.fourButtonContainer}>
            <View style={styles.fourButton}>
                <TouchableOpacity style={styles.buttonWithBackground} onPress={() => openModal(500)} >
                    <Image style={styles.fourButtonImages} source={require('../../../assets/images/team.png')} />
                    <Text style={styles.buttonText}>Team</Text>
                </TouchableOpacity>
            </View>
            {/* 모달 */}
        <BottomSheetModal visible={modalVisible} onClose={() => setModalVisible(false)} height={modalHeight}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Who you are working with ({format(selectedDate, 'yyyy-MM-dd')})</Text>
            <View style={styles.dottedLine} />

            {shifts.length > 0 ? (
              shifts.map((shift, index) => (
                <View key={index} style={styles.shiftItem}>
                  <Text style={styles.employeeName}>{shift.employeeName}</Text>
                  <Text style={styles.shiftTime}>
                    {format(new Date(shift.shiftStartDate), 'hh:mm a')} - {format(new Date(shift.shiftEndDate), 'hh:mm a')}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noShiftText}>No employees are working on this date.</Text>
            )}
          </View>
        </BottomSheetModal>
            
            <View style={styles.fourButton}>
                <TouchableOpacity style={styles.buttonWithBackground}>
                    <Image style={styles.fourButtonImages} source={require('../../../assets/images/event1.png')} />
                    <Text style={styles.buttonText}>Event</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.fourButton}>
                <TouchableOpacity style={styles.buttonWithBackground}>
                    <Image style={styles.fourButtonImages} source={require('../../../assets/images/request.png')} />
                    <Text style={styles.buttonText}>Request</Text>    
                </TouchableOpacity>
            </View>
            
            <View style={styles.fourButton}>
                <TouchableOpacity style={styles.buttonWithBackground}>
                    <Image style={styles.fourButtonImages} source={require('../../../assets/images/late.png')} />
                    <Text style={styles.buttonText}>Late</Text>    
                </TouchableOpacity>
            </View>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.card}>
          <Text style={styles.monthText}>{format(selectedDate, 'MMMM yyyy')}</Text>
          <View style={styles.weekContainer}>
            {currentWeek.map((day) => (
              <TouchableOpacity key={day.toISOString()} style={[styles.dayContainer, isSameDay(day, selectedDate) && styles.selectedDay]}
                onPress={() => setSelectedDate(day)}>
                <Text style={styles.dayText}>{format(day, 'EEE')}</Text>
                <Text style={styles.dateText}>{format(day, 'd')}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Event Details for the Selected Date
        Some of this code was generated with assistance from chatGPT
        Prompt: Write a React Native component that displays a list of shifts fetched from an API.
        Use a ScrollView to allow scrolling and display a loading indicator while fetching data. 
         */}
          <ScrollView>
          {loading ? (
          <Text>Loading...</Text>
          ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                  <View key={event.eventId} style={styles.eventContainer}>
                    <Text style={styles.eventText}>Events</Text>
                    <View style={styles.dottedLine}></View>
                      <Text style={styles.eventText}>
                      {event.eventName} ({event.numberOfGuests} Guests)
                      </Text>
                      <Text style={styles.eventText}>
                        {format(new Date(event.eventStartDate), 'hh:mm a')} - {format(new Date(event.eventEndDate), 'hh:mm a')}
                      </Text>
                      <View style={styles.dottedLine}></View>
                  </View>
            ))
            ) : (
              <View style = {styles.detailsContainer}>
                <View style = {styles.childContainer}>
                  <Text style = {styles.orange}>{format(selectedDate, 'd')}</Text>
                  <Text style={styles.bold}>{format(selectedDate, 'EEE')} </Text>
                </View>
                <View style = {styles.childContainer}>
                  <Text style={styles.bold}> No Shifts for this date.</Text>
                </View>
              </View>
                )}
          </ScrollView>
        </View>
    </View>
    </MainLayout>
  );
};

export default EmployeeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 3,
  },
  greeting: {
    fontSize: 18,
    color: '#00000080',
    fontWeight: 'bold',
    paddingLeft: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    paddingLeft: 15,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContainer: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#d1e3f0',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#fff',
  },
  cardRequest: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dayContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  selectedDay: {
    backgroundColor: '#FFB74D',
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    color: '#000',
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hourContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  hourTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  hourTask: {
    fontSize: 14,
    color: '#555',
  },
  eventContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
    alignItems: 'center',
  },
  dottedLine: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    width: '100%',
    marginVertical: 5,
    borderColor: '#000',
  },
  eventText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  noEventsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  fourButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16, 
    paddingVertical: 16, 
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
},
fourButton: {
    alignItems: 'center',
},
fourButtonImages: {
    width: 50,
    height: 50,
    marginBottom: 4,
},
buttonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
},
childContainer:{
  flexDirection:"column",
  justifyContent:'center',
  margin: 10,
  textAlign: 'center',
},
bold:{
  fontWeight:'bold',
  fontSize:16,
  textAlign:'center',
},
orange:{
  color:"#F4A261",
  fontSize:20,
  textAlign:'center',
},
grey:{
  color:'grey',
},
});