import React, { useState } from 'react';
import MiniSchedule from './MiniSchedule';
import { useNavigate } from 'react-router-dom';
import Overlay from './Overlay';
import EditEvent from '../screens/EditEvent';
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


export default function EventBar({events}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate(); // Initialize the router
  const [activeOverlay, setActiveOverlay]= useState(false)

  const openOverlay = (event) => {
    setSelectedEvent(event);
    setActiveOverlay(true);
  };

  const closeOverlay = () => {
    setSelectedEvent(null);
    setActiveOverlay(false);
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
          closeOverlay();
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

    closeOverlay();
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
        <div key={event.eventId} className=""  onClick={() => openOverlay(event)}>
          <MiniSchedule EventName={event.eventName} EventStartTime={new Date(event.eventStartDate)} />
        </div>
      ))}
    </div>
  )}

      {/* Event Details Modal */}
      {selectedEvent && activeOverlay && (
        <Overlay  headerTitle ={selectedEvent.eventName} ButtonTitle={"Test"} buttonPlacement={"invisible pointer-events-none"} isActive={activeOverlay} onToggle={setActiveOverlay} child= {
        <div className="">
          <div className="modal-container">
            <h2 className="modal-title"><strong> {selectedEvent?.eventName}</strong></h2>
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
              <Overlay child={<EditEvent eventId={selectedEvent.eventId}/>} headerTitle={"Edit Event"} ButtonTitle={"Edit Event"} buttonPlacement={"top-[50vh]"} 
                          isActive={activeOverlay === "Edit Event"} 
                      onToggle={setActiveOverlay}/>
              <button className="basic-button w-24 my-1" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      }    />)}
    </div>
  );
}
