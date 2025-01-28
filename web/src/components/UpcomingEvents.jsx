import React, {useState,useEffect}from "react";
import { useNavigate } from "react-router-dom";
import EventBar from "./EventBar";



function filterEvents(day,events){
  if (events) {
  const eventList = events.filter(event => event.eventStartDate.split("T")[0] == day.toISOString().split("T")[0])
  return eventList
  }
}


export default function UpcomingEvents({selectedDay}){
    const [events, setEvents] = useState([]); // State to store events from the backend
    const [filteredEvents,setFilteredEvents] = useState([])
    const [error, setError] = useState(null); // State for error handling
    const navigate = useNavigate();
    const BASE_URL =  'http://localhost:8080/api/events';
  
    // Function to fetch events from the backend
    const fetchEvents = async () => {
    
      setError(true); // Reset error state
      try {
        const response = await fetch(`${BASE_URL}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data)
        
         // Update the state with the fetched events
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Please try again later.');
      }
    };
  
    // Fetch events whenever the selected option changes
    useEffect(() => {
      fetchEvents();
    }, []);

    useEffect(() => {
      if (selectedDay && events.length > 0) {
        const filtered = filterEvents(selectedDay, events);
        setFilteredEvents(filtered);
      } else {
        setFilteredEvents([]);
      }
    }, [selectedDay, events]);
    
    return (
              <div className="text-center">
                {/* Scrollable Event List */}
                <div className="event-list">
                  <EventBar events={filteredEvents} />
                </div>
              </div>
          );
  }