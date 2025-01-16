import React, { useState } from 'react';
import MiniSchedule from './MiniSchedule';
import { useNavigate } from 'react-router-dom';

//Made By Aaron, Tyson and Michelle 
//Converted from React Native with help from Chat-GPT

//Made By:
//Refrences
// General Purpose 

const testEvent = [{
  eventId: 1,
     eventName: 'Rock', // Event title
      eventStartDate : Date.now(), // Event start date (UTC)
      eventEndDate : Date.now(), // Event start time
    eventLocation: 'There', // Event location
    numberOfGuests: 10, // Number of expected guests
    assignedManager : 'bob',
specialRequirements : 'nope' // Additional event requirement



}]


function format(date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }


export default function EventBar({ events, filterType }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate(); // Initialize the router

    events = testEvent
  const currentDate = new Date();

  // Filter events based on filterType ('past' or 'upcoming')
  const filteredEvents = events.filter((event) => {
    const eventStartTime = new Date(event.eventStartDate);
    const eventEndTime = new Date(event.eventEndDate);

    if (filterType === 'past') {
      return eventStartTime < currentDate;
    } else if (filterType === 'upcoming') {
      return eventEndTime > currentDate;
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
    navigate(`/screens/EventEdit?eventId=${selectedEvent.eventId}`);
    closeModal();
  };

  const handleDelete = () => {
    // Handle the delete action
    alert(`Event "${selectedEvent.EventName}" deleted.`);
    closeModal();
  };

  // Format date safely, return fallback text if invalid date
  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? 'Invalid date' : format(parsedDate, 'MMM dd, yyyy h:mm a');
  };

  return (
    <div className="container">
      <div className="scroll-container">
        {filteredEvents.map((event) => (
          <div key={event.eventId} className="event-item" onClick={() => openModal(event)}>
            <MiniSchedule EventName={event.eventName} EventStartTime={new Date(event.eventStartDate)} />
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && modalVisible && (
        <div className="modal-background">
          <div className="modal-container">
            {/* Close button (X) */}
            <button className="close-button" onClick={closeModal}>
              X
            </button>

            <h2 className="modal-title">{selectedEvent?.eventName}</h2>
            <p className="modal-details">
              <strong>Start Time:</strong> {formatDate(selectedEvent?.eventStartDate)}
            </p>
            <p className="modal-details">
              <strong>End Time:</strong> {formatDate(selectedEvent?.eventEndDate)}
            </p>
            <p className="modal-details">
              <strong>Room:</strong> {selectedEvent?.eventLocation}
            </p>
            <p className="modal-details">
              <strong>Description:</strong> {selectedEvent?.specialRequirements || 'No description available'}
            </p>

            {/* Edit and Delete buttons */}
            <div className="modal-actions">
              <button className="button" onClick={handleEdit}>
                Edit
              </button>
              <button className="button delete-button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
