import React, { useState } from 'react';
import { ScrollView, Pressable, StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MiniSchedule from './MiniSchedule';
import { format } from 'date-fns'; // For date formatting

export default function EventBar({ events, filterType }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const router = useRouter(); // Initialize the router

  const currentDate = new Date();

  // Filter events based on filterType ('past' or 'upcoming')
  const filteredEvents = events.filter((event) => {
    const eventStartTime = new Date(event.eventStartDate);
    if (filterType === 'past') {
      return eventStartTime < currentDate;
    } else if (filterType === 'upcoming') {
      return eventStartTime > currentDate;
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
    alert(`Event "${selectedEvent.eventName}" deleted.`);
    closeModal();
  };

  // Format date safely, return fallback text if invalid date
  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? 'Invalid date' : format(parsedDate, 'MMM dd, yyyy h:mm a');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {filteredEvents.map((event) => (
          <Pressable key={event.eventId} onPress={() => openModal(event)}>
            <MiniSchedule
              EventName={event.eventName}
              EventStartTime={new Date(event.eventStartDate)}
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
              <Text style={styles.modalTitle}>{selectedEvent?.eventName}</Text>
              <Text style={styles.modalDetails}>
                <Text style={styles.bold}>Start Time:</Text> {formatDate(selectedEvent?.eventStartDate)}
              </Text>
              <Text style={styles.modalDetails}>
                <Text style={styles.bold}>End Time:</Text> {formatDate(selectedEvent?.eventEndDate)}
              </Text>
              <Text style={styles.modalDetails}>
                <Text style={styles.bold}>Room:</Text> {selectedEvent?.eventLocation}
              </Text>
              <Text style={styles.modalDetails}>
                <Text style={styles.bold}>Description:</Text> {selectedEvent?.specialRequirements || 'No description available'}
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
