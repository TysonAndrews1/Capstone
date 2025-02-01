import React, {useState,useEffect}from "react";
import { useNavigate } from "react-router-dom";
import EventBar from "./EventBar";
import { getEvents } from "./FetchData";





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

  

    useEffect(() => {
      setError(true); // Reset error state
      getEvents().then(events => setEvents(events)) // Gets the resolved data
    }, []);

        // Fetch events whenever the selected option changes

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