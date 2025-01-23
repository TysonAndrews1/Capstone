import React, { useState } from 'react';
import MiniSchedule from './MiniSchedule';
import { useNavigate } from 'react-router-dom';

//Made By Aaron, Tyson and Michelle 
//Converted from React Native with help from Chat-GPT

//Made By:
//Refrences
// General Purpose 



function format(date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }


export default function EventBar({ events}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate(); // Initialize the router
  const currentDate = new Date();


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
    navigate(`/EditEvent/${selectedEvent.eventId}`)
    closeModal();
  };

  const handleDelete = () => {
    // Handle the delete action
  
    fetch(`http://localhost:8080/api/events/${selectedEvent.eventId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          alert(`Event "${selectedEvent.eventName}" deleted.`);
          // Remove the event from the local state to update the UI
          const updatedEvents = events.filter((event) => event.eventId !== selectedEvent.eventId);
          closeModal();
        } else {
          response.json().then((data) => {
            console.log('Delete failed:', data); // Log error for debugging
            alert(data.message || 'Failed to delete event.');
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting event:', error);
        alert('An error occurred while deleting the event.');
      });

    closeModal();
  };

  // Format date safely, return fallback text if invalid date
  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? 'Invalid date' : format(parsedDate, 'MMM dd, yyyy h:mm a');
  };

  return (
<div className="container">
  {events.length === 0 ? (
    <p className="text-center text-gray-500 my-4">No Events Today.</p> // Message if events is empty
  ) : (
    <div className="scroll-container">
      {events.map((event) => (
        <div key={event.eventId} className="" onClick={() => openModal(event)}>
          <MiniSchedule EventName={event.eventName} EventStartTime={new Date(event.eventStartDate)} />
        </div>
      ))}
    </div>
  )}

      {/* Event Details Modal */}
      {selectedEvent && modalVisible && (
        <div className="">
          <div className="modal-container">
            {/* Close button (X) */}
            <button className="close-button " onClick={closeModal}>
              X
            </button>

            <h2 className="modal-title"><strong>Event Title: </strong>{selectedEvent?.eventName}</h2>
            <div className="modal-content flex flex-col items-start space-y-2">
  <div className="flex">
    {/* First Column */}
    <div className="flex-none  text-left">
      <p><strong>Start Time:</strong></p>
      <p><strong>End Time:</strong></p>
      <p><strong>Room:</strong></p>
      <p><strong>Description:</strong></p>
    </div>

    {/* Second Column */}
    <div className="flex-grow text-left">
      <p>{formatDate(selectedEvent?.eventStartDate)}</p>
      <p>{formatDate(selectedEvent?.eventEndDate)}</p>
      <p>{selectedEvent?.eventLocation}</p>
      <p>{selectedEvent?.specialRequirements || 'No description available'}</p>
    </div>
  </div>
</div>

            {/* Edit and Delete buttons */}
            <div className="modal-actions">
              <button className="basic-button w-24" onClick={handleEdit}>
                Edit 
              </button>
              <button className="basic-button w-24 my-1" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
