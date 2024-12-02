import React, { useState } from 'react';
import { ScrollView, Pressable, StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MiniSchedule from './MiniSchedule';
import { format } from 'date-fns'; // For date formatting

export default function EventBar({ TimeFrame }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const router = useRouter(); // Initialize the router

  // Example events
  const testEvents = [
    {
      eventId: 1,
      eventType: 'Wedding',
      EventName: 'Alice & Bob Wedding',
      EventStartTime: new Date(2024, 9, 10, 8, 30),
      EventEndTime: new Date(2024, 9, 10, 12, 0),
      Room: 'Grand Ballroom',
      Description: 'A beautiful wedding celebration!',
    },
    {
      eventId: 2,
      eventType: 'Conference',
      EventName: 'Tech Conference 2023',
      EventStartTime: new Date(2023, 11, 15, 9, 0),
      EventEndTime: new Date(2023, 11, 15, 17, 0),
      Room: 'Conference Hall A',
      Description: 'A full-day tech conference with various workshops.',
    },
    // Added test events for 2025
    {
      eventId: 3,
      eventType: 'Workshop',
      EventName: 'React Native Workshop',
      EventStartTime: new Date(2025, 2, 21, 9, 0),  // March 21, 2025, 9:00 AM
      EventEndTime: new Date(2025, 2, 21, 17, 0),  // March 21, 2025, 5:00 PM
      Room: 'Tech Hub Room 1',
      Description: 'A hands-on workshop to learn React Native.',
    },
    {
      eventId: 4,
      eventType: 'Concert',
      EventName: 'Summer Music Concert',
      EventStartTime: new Date(2025, 5, 15, 19, 30), // June 15, 2025, 7:30 PM
      EventEndTime: new Date(2025, 5, 15, 22, 0),  // June 15, 2025, 10:00 PM
      Room: 'Main Stage',
      Description: 'An exciting music concert featuring popular bands.',
    },
    {
      eventId: 5,
      eventType: 'Conference',
      EventName: 'AI & ML Global Summit',
      EventStartTime: new Date(2025, 7, 10, 8, 0),  // August 10, 2025, 8:00 AM
      EventEndTime: new Date(2025, 7, 10, 18, 0),  // August 10, 2025, 6:00 PM
      Room: 'AI Conference Hall',
      Description: 'A summit on the latest advancements in AI and Machine Learning.',
    },
    {
      eventId: 6,
      eventType: 'Festival',
      EventName: 'Autumn Festival',
      EventStartTime: new Date(2025, 9, 3, 10, 0),  // October 3, 2025, 10:00 AM
      EventEndTime: new Date(2025, 9, 3, 16, 0),  // October 3, 2025, 4:00 PM
      Room: 'Festival Grounds',
      Description: 'A community festival featuring local artisans, food trucks, and live music.',
    },
  ];

  const currentDate = new Date();

  // Filter events based on filterType ('past' or 'upcoming')
  const filteredEvents = testEvents.filter((event) => {
    if (TimeFrame === 'past') {
      return event.EventStartTime < currentDate;
    } else if (TimeFrame === 'upcoming') {
      return event.EventStartTime > currentDate;
    }
    return true; // Default behavior if no filterType is passed
  });

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const handleEdit = () => {
    // Navigate to the Edit screen
    router.push(`/screens/EventEdit?eventId=${selectedEvent.eventId}`);
    closeModal();
  };

  const handleDelete = () => {
    // Handle the delete action (you would typically delete it from state or database)
    alert(`Event "${selectedEvent.EventName}" deleted.`);
    closeModal();
  };

  // Format date safely, return fallback text if invalid date
  const formatDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      return format(date, 'MMM dd, yyyy h:mm a'); // Format the date correctly
    }
    return 'Invalid date'; // Return fallback text for invalid dates
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {filteredEvents.map((event) => (
          <Pressable key={event.eventId} onPress={() => openModal(event)}>
            <MiniSchedule
              eventType={event.eventType}
              EventName={event.EventName}
              EventStartTime={event.EventStartTime}
            />
          </Pressable>
        ))}
      </ScrollView>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {/* Close button (X) */}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>{selectedEvent?.EventName}</Text>
              <Text style={styles.modalDetails}>
                <Text style={styles.bold}>Start Time:</Text> {formatDate(selectedEvent?.EventStartTime)}
              </Text>
              <Text style={styles.modalDetails}>
                <Text style={styles.bold}>End Time:</Text> {formatDate(selectedEvent?.EventEndTime)}
              </Text>
              <Text style={styles.modalDetails}>
                <Text style={styles.bold}>Room:</Text> {selectedEvent?.Room}
              </Text>
              <Text style={styles.modalDetails}>
                <Text style={styles.bold}>Description:</Text> {selectedEvent?.Description}
              </Text>

              {/* Edit and Delete buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.button} onPress={handleEdit}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    width: '100%',
    padding: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 16,
    marginVertical: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  modalActions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    margin: 5,
    paddingVertical: 15,
    backgroundColor: '#3F6D89',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#D32F2F', // Red for delete
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
