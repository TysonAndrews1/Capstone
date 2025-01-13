import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import MainLayout from "../../layouts/MainLayout";
import CalendarComponent from "../../components/Calender";
import MiniSchedule from "../../components/MiniSchedule";
import { useRouter } from 'expo-router';

const ManageEvents = () => {
  
  const [selectedDate, setSelectedDate] = useState(null); // State to manage the selected date
  const [events, setEvents] = useState([]); // State to hold all event data
  const [filteredEvents, setFilteredEvents] = useState([]); // State to hold events filtered by the selected date
  const [loading, setLoading] = useState(false); // Loading state to show spinner or message during data fetching
  const [error, setError] = useState(null); // Error state to handle API fetch errors
  const router = useRouter(); // For navigating to other screens

  /**
   * Fetch all events from the backend API.
   * Sets the 'events' state with the fetched data.
   * Handles loading and error states during the fetch process.
   */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://10.0.2.2:8080/api/events"); // API call to fetch events
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data); // Store the fetched data in 'events'
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events. Please try again."); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  /**
   * Filters the list of events based on the selected date.
   * @param {Date} date - The selected date to filter events.
   * @returns {Array} - List of events happening on the selected date.
   */
  const filterEventsByDate = (date) => {
    if (!date) return []; // Return empty array if no date is selected
    return events.filter((event) => {
      const eventDate = new Date(event.eventStartDate); // Parse event start date (in UTC)
      return (
        eventDate.getUTCFullYear() === date.getUTCFullYear() &&
        eventDate.getUTCMonth() === date.getUTCMonth() &&
        eventDate.getUTCDate() === date.getUTCDate()
      );
    });
  };

  /**
   * Handles the selection of a date from the calendar.
   * Updates the 'selectedDate' and filters the events for that date.
   * @param {Date} date - The selected date from the calendar 
   */
  const handleDateSelect = (date) => {
    setSelectedDate(date); 
    const filtered = filterEventsByDate(date);
    setFilteredEvents(filtered); 
  };

  // Fetch all events when the component loads
  useEffect(() => {
    fetchEvents(); // Call the fetchEvents function
  }, []);

  return (
    <MainLayout>
      <View style={styles.container}>

        {/* Calendar Component for date selection */}
        <View style={styles.calendarWrapper}>
          <CalendarComponent onDateSelect={handleDateSelect} />
        </View>

        {/* Conditional rendering based on whether a date is selected */}
        {selectedDate ? (
          // If a date is selected, show filtered events for that date
          <ScrollView style={{ flex: 1, marginTop: 10 }}>
            {loading ? (
              // Show loading message if events are being fetched
              <Text style={styles.loadingText}>Loading...</Text>
            ) : filteredEvents.length > 0 ? (
              // Show the filtered list of events
              filteredEvents.map((event) => (
                <MiniSchedule
                  key={event.eventId}
                  EventName={event.eventName}
                  EventStartTime={event.eventStartDate}
                  EventEndTime={event.eventEndDate}
                  Guests={event.numberOfGuests}
                />
              ))
            ) : (
              // Show message if no events are available for the selected date
              <Text style={styles.noEventsText}>No events for this date.</Text>
            )}
          </ScrollView>
        ) : (
          // If no date is selected, show a prompt to select a date or create a new event
          <View style={styles.noDateContainer}>
            <Text style={styles.noDateText}>Select a day to view events</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('screens/manager/EventEdit')} // Navigate to the event creation screen
            >
              <Text style={styles.createButtonText}>Create new event</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </MainLayout>
  );
};

export default ManageEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  noDateContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  noDateText: {
    fontSize: 18,
    color: "#F4A261",
    textAlign: "center",
    marginBottom: 10, 
  },
  createButton: {
    marginTop: 10, 
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: "#E6F2FA",
    borderRadius: 5,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  calendarWrapper: {
    marginBottom: 10, 
  },
});