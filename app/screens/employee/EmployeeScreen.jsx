import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { format, startOfWeek, addDays, isSameDay, parseISO, isWithinInterval, set } from 'date-fns';
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
  const [modalHeight, setModalHeight] = useState(500);

  const [eventsModalVisible, setEventsModalVisible] = useState(false);
  const [eventDetailModalVisible, setEventDetailModalVisible] = useState(false);
  const [weeklyEvents, setWeeklyEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
  // Prompt: I want to get shifts with selected date and employee names who have shifts selected date.
  const fetchShiftsForSelectedDate = async () => {
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(`${BASE_URL}/shifts?date=${formattedDate}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Filter only matched date
      const filteredShifts = data.filter((shift) => {
        const shiftDate = parseISO(shift.shiftStartDate); // Convert the date
        return isSameDay(shiftDate, selectedDate);
      });

      setShifts(filteredShifts);

      await fetchEmployeeNames(filteredShifts);
    } catch (err) {
      console.error('Error fetching shifts:', err);
      setShifts([]);
    }
  };

  // This code generated with assistance with chatGPT.
  // Prompt: It was the same as fetchShiftsForSelectedDate function.
  const fetchEmployeeNames = async (shiftsData) => {
    try {
      // Extract unique account IDs from shiftsData
      const uniqueAccountIds = [...new Set(shiftsData.map(shift => shift.accountId))];

      // Fetch employee details for each unique accountId
      const employeeRequests = uniqueAccountIds.map(async (accountId) => {
        const response = await fetch(`${BASE_URL}/accounts/${accountId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse response as JSON
      });

      // Wait for all employee data requests to complete
      const employees = await Promise.all(employeeRequests);

      // Create a mapping of accountId to employee name
      const employeeMap = {};
      employees.forEach(emp => {
        employeeMap[emp.accountId] = `${emp.firstName} ${emp.lastName}`;
      });
      console.log("Employee Data Map:", employeeMap); // Debugging log

      // Update shiftsData with employee names
      const updatedShifts = shiftsData.map(shift => ({
        ...shift,
        employeeName: employeeMap[shift.accountId] || "Unknown",
      }));

      setShifts(updatedShifts);
      
  } catch (err) {
    console.error('Error fetching employee names:', err);
  }
  };


const openEventsModal = async () => {
  try {

    let startOfWeekDate = startOfWeek(new Date(selectedDate), { weekStartsOn: 0 });
    startOfWeekDate = set(startOfWeekDate, { hours: 0, minutes: 0, seconds: 0 });

    let endOfWeekDate = addDays(startOfWeekDate, 6);
    endOfWeekDate = set(endOfWeekDate, { hours: 23, minutes: 59, seconds: 59 });

    const response = await fetch(`${BASE_URL}/events`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    //  filtering for full-day comparison
    const filteredEvents = data.filter((event) => {
      const eventDate = new Date(event.eventStartDate);

      return isWithinInterval(eventDate, {
        start: startOfWeekDate,
        end: endOfWeekDate
      });
    });

    setWeeklyEvents(filteredEvents);
    setEventsModalVisible(true);
  } catch (err) {
    console.error('Error fetching weekly events:', err);
  }
};
  // Open event detail modal when clicking
  const openEventDetailFromList = (event) => {
    setSelectedEvent(event);
    setTimeout(() => setEventDetailModalVisible(true), 300);
  }
  const openEventDetail = (event) => {
    setSelectedEvent(event);
    setEventsModalVisible(false); // Close the event list modal 
    setTimeout(() => setEventDetailModalVisible(true), 300); // Open event detail modal
  }
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
                <TouchableOpacity style={styles.buttonWithBackground} onPress={openModal} >
                    <Image style={styles.fourButtonImages} source={require('../../../assets/images/team.png')} />
                    <Text style={styles.buttonText}>Team</Text>
                </TouchableOpacity>
            </View>
            {/* Modal content with shift details */}
            <BottomSheetModal visible={modalVisible} onClose={() => setModalVisible(false)} height={modalHeight}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Who you are working with</Text>
                <View style={styles.dottedLine} />

                {shifts.length > 0 ? (
                  shifts.map((shift, index) => (
                    <View key={index} style={styles.eventCard}>
                      <View style={styles.eventIconContainer}> 
                        <Image source={require('../../../assets/images/face.png')} style={styles.eventIcon} />
                      </View>

                      <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle}>{shift.employeeName}</Text>
                        <Text style={styles.eventTime}>
                          {format(new Date(shift.shiftStartDate), 'hh:mm a')} - {format(new Date(shift.shiftEndDate), 'hh:mm a')}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noShiftText}>No employees are working on this date.</Text>
                )}
              </View>
            </BottomSheetModal>
            
            <View style={styles.fourButton}>
                <TouchableOpacity style={styles.buttonWithBackground} onPress={openEventsModal}>
                    <Image style={styles.fourButtonImages} source={require('../../../assets/images/event1.png')} />
                    <Text style={styles.buttonText}>Event</Text>
                </TouchableOpacity>
            </View>

            {/* Weekly event list */}
            <BottomSheetModal visible={eventsModalVisible} onClose={() => setEventsModalVisible(false)} height={500}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Events for this week</Text>
                <View style={styles.dottedLine} />

                {weeklyEvents.length > 0 ? (
                  weeklyEvents.map((event, index) => (
                    <TouchableOpacity key={index} style={styles.eventCard} onPress={() => openEventDetail(event)}>
                      
                      <View style={styles.eventIconContainer}>
                        <Image source={require('../../../assets/images/event11.png')} style={styles.eventIcon} />
                      </View>
                      <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle}>{event.eventName}</Text>
                        <Text style={styles.eventGuests}>{event.numberOfGuests} Guests</Text>
                        <Text style={styles.eventTime}>
                          {format(new Date(event.eventStartDate), 'hh:mm a')} - {format(new Date(event.eventEndDate), 'hh:mm a')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noEventText}>No events scheduled for this week.</Text>
                )}
              </View>
            </BottomSheetModal>

            {/* Event detail information */}
            <BottomSheetModal visible={eventDetailModalVisible} onClose={() => setEventDetailModalVisible(false)} height={500}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Event Details</Text>
                <View style={styles.dottedLine} />
                {selectedEvent && (
                  <>
                    <Text style={styles.detailLabel}>Company Name:</Text>
                    <Text style={styles.detailText}>{selectedEvent.companyName}</Text>

                    <Text style={styles.detailLabel}>Type of Event:</Text>
                    <Text style={styles.detailText}>{selectedEvent.eventType}</Text>

                    <Text style={styles.detailLabel}>Guest Count:</Text>
                    <Text style={styles.detailText}>{selectedEvent.numberOfGuests}</Text>

                    <Text style={styles.detailLabel}>Special Requirements:</Text>
                    <Text style={styles.detailText}>{selectedEvent.specialRequirements}</Text>
                  </>
                )}
              </View>
            </BottomSheetModal>

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
              <View style={styles.eventListContainer}>
                {/* Individual event list */}
                {filteredEvents.map((event) => (
                  <TouchableOpacity 
                    key={event.eventId} 
                    style={styles.eventCard} 
                    onPress={() => openEventDetailFromList(event)}
                  >
                    <View style={styles.eventIconContainer}>
                      <Image source={require('../../../assets/images/event11.png')} style={styles.eventIcon} />
                    </View>
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle}>{event.eventName}</Text>
                      <Text style={styles.eventGuests}>{event.numberOfGuests} Guests</Text>
                      <Text style={styles.eventTime}>
                        {format(new Date(event.eventStartDate), 'hh:mm a')} - {format(new Date(event.eventEndDate), 'hh:mm a')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.detailsContainer}>
                <View style={styles.childContainer}>
                  <Text style={styles.orange}>{format(selectedDate, 'd')}</Text>
                  <Text style={styles.bold}>{format(selectedDate, 'EEE')} </Text>
                </View>
                <View style={styles.childContainer}>
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

modalContent: {
  padding: 20,
},
shiftItem: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  backgroundColor: '#f0f0f0',
  marginVertical: 5,
  borderRadius: 10,
},
profileImage: {
  width: 40,
  height: 40,
  marginRight: 10,
},
shiftDetails: {
  flex: 1,
},
employeeName: {
  fontSize: 16,
  fontWeight: 'bold',
},
shiftTime: {
  fontSize: 14,
  color: '#555',
},
noShiftText: {
  textAlign: 'center',
  color: '#888',
},
eventCard: {
  flexDirection: 'row', 
  alignItems: 'center',
  backgroundColor: '#fff', 
  padding: 15,
  marginVertical: 5,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

eventIconContainer: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: '#e0f7fa', 
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 15,
},

eventIcon: {
  width: 30,
  height: 30,
  tintColor: '#007AFF', 
},

eventInfo: {
  flex: 1,
},

eventTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},

eventGuests: {
  fontSize: 14,
  color: '#666',
  marginTop: 3,
},

eventTime: {
  fontSize: 14,
  color: '#888',
  marginTop: 5,
},

noEventText: {
  fontSize: 16,
  color: '#888',
  textAlign: 'center',
  marginTop: 20,
},
modalContent: {
  padding: 20,
  backgroundColor: '#fff',
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
  marginBottom: 10,
},

dottedLine: {
  borderBottomWidth: 1,
  borderStyle: 'dotted',
  width: '100%',
  marginVertical: 5,
  borderColor: '#ccc',
},

detailLabel: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#555',
  marginTop: 10,
},

detailText: {
  fontSize: 16,
  color: '#333',
  marginBottom: 5,
},
});