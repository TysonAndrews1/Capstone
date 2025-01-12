import { View, Text, StyleSheet,  Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const BASE_URL = 'http://10.0.2.2:8080/api/events';

const ManagerScreen = () => {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function getCurrentWeek() {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))[0]; // 첫 번째 사용자만 가져옴
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`${BASE_URL}?date=${formattedDate}`);
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

  {/** Get the time of day message */}
  const getTimeOfDayMessage = () => {
    {/** using built-in Data component */}
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.eventStartDate); // ISO 8601 문자열을 Date 객체로 변환
    return isSameDay(eventDate, selectedDate); // 날짜 비교
  });

  return (
    <MainLayout>
      {/** Greeting managers depends on time */}
      <View style={styles.container}>
        <Text style={styles.greeting}>{getTimeOfDayMessage()},</Text>
        <Text style={styles.name}>
          {user ? `${user.firstName}` : "Loading..."}
        </Text>

        {/** Show personal information? */}
        <View style={{ ...styles.card, backgroundColor: '#212124' }}>
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>
              {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </Text>
            <Text style={styles.cardSubtitle}>
              {user ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : "Loading..."}
            </Text>
            <Text style={styles.cardText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at elit non felis elementum dictum. Donec ac condimentum nisl.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.card}>
          <View style={styles.cardRequest}>
            <Image source={require('../../../assets/images/error.png')} style={{ width: 48, height: 48, marginRight: 10, }} />
            <Text style={styles.monthText}>(3) New Employee Requests</Text>
          </View>  
        </TouchableOpacity>

        <View style={styles.card}>
        <Text style={styles.monthText}>{format(selectedDate, 'MMMM yyyy')}</Text>
        <View style={styles.weekContainer}>
          {currentWeek.map((day) => (
            <TouchableOpacity key={day.toISOString()} style={[styles.dayContainer, isSameDay(day, selectedDate) && styles.selectedDay,]}
            onPress={() => setSelectedDate(day)}>
              <Text style={styles.dayText}>{format(day, 'EEE')}</Text>
              <Text style={styles.dateText}>{format(day, 'd')}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.detailsContainer}>
        <ScrollView>
            {loading ? (
              <Text>Loading...</Text>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <View key={event.eventId} style={styles.eventContainer}>
                  {/* 위 점선 */}
                  <View style={styles.dottedLine}></View>

                  {/* 시작시간 - 끝나는시간 */}
                  <Text style={styles.timeText}>
                    {format(new Date(event.eventStartDate), 'hh:mm a')} -{' '}
                    {format(new Date(event.eventEndDate), 'hh:mm a')}
                  </Text>

                  {/* 이벤트 이름 및 게스트 숫자 */}
                  <Text style={styles.eventDetails}>
                    {event.eventName} ({event.numberOfGuests} Guests)
                  </Text>

                  {/* 아래 점선 */}
                  <View style={styles.dottedLine}></View>
                </View>
              ))
            ) : (
              <Text style={styles.noEventsText}>No events for this date.</Text>
            )}
          </ScrollView>
          </View>
        </View>
      </View>
    </MainLayout>
  );
};

export default ManagerScreen;

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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginBottom: 10,
    alignItems: 'center',
  },
  dottedLine: {
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    width: '90%',
    marginVertical: 5,
    borderColor: '#999',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventDetails: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  noEventsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
});