import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL =  'http://localhost:8080/api/events';

const formatDate = (e) => {
  const localDate = e.target.value; // "2024-12-15T22:00"
  const fullDate = formatDate(localDate);
  console.log("Full ISO Date:", fullDate); // Logs "2024-12-15T22:00:00.000Z"
  return(fullDate); // Update the state
};

const isoToDateTimeLocal = (isoString) => {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000; // Adjust for timezone offset
  const localDate = new Date(date.getTime() - offset); // Localized date
  return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
};

const LoadEvent = async (eventId) => {
  try {
    const response = await fetch(`${BASE_URL}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    
    return data.find((event) => event.eventId == eventId);
  } catch (err) {
    console.error('Error fetching events:', err);
  }
};

const EditEvent =() =>{

  const navigate = useNavigate();
  const { eventId } = useParams(); // Get the event ID from the URL
  const [loading, setLoading] = useState(true); // For handling loading state
  const [error, setError] = useState(""); // For handling errors
  const [eventTitle, setEventTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [eventManager, setEventManager] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await LoadEvent(eventId);
        console.log(event);
        
        if (event) {
          // Update the states with the loaded event data
          setEventTitle(event.eventName );
          setStartDate(isoToDateTimeLocal(event.eventStartDate));
          setEndDate(isoToDateTimeLocal(event.eventEndDate));
          setLocation(event.eventLocation );
          setNumberOfGuests(event.numberOfGuests );
          setEventManager(event.assignedManager );
          setSpecialRequirements(event.specialRequirements);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError("Failed to load event data. Please try again later.");
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);
  
  if (loading) {return <div>Loading...</div>;}
  if (error) {return <div>Error: {error}</div>;}

    const handleSubmit = () => {
        if (!eventTitle || !startDate  || !endDate || !location || !numberOfGuests || !eventManager) {
          alert("Error", "Please fill in all the fields");
          return;
          
        }
        
        const BASE_URL = 'http://localhost:8080/api/events';
        const newEvent = {
            eventId: eventId,
            eventName: eventTitle,
            eventStartDate: startDate,
            eventEndDate: endDate,
            eventLocation: location,
            numberOfGuests: parseInt(numberOfGuests),
            assignedManager: eventManager,
            specialRequirements: specialRequirements,
          };

          fetch(BASE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEvent),
            })
            .then((response) => response.json())
            .catch((error) => {
              console.error('Error creating event:', error);
              alert("Error", "Failed to create event");
            });

    }

    return(
    <main>
        <form onSubmit={handleSubmit}>
        <div>
        <input
          type="text"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <label>Event Title</label>
      </div>
      <div>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>Start Date</label>
      </div>
      <div>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        <label>End Date</label>
      </div>

      <div>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <label>Room</label>
      </div>
      <div>
        <input
          type="number"
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(Number(e.target.value))}
        />
        <label>Amount of people</label>
      </div>
      <div>
        <input
          type="text"
          value={eventManager}
          onChange={(e) => setEventManager(e.target.value)}
        />
        <label>Presiding Manager</label>
      </div>
      <div>
        <input
          type="text"
          value={specialRequirements}
          onChange={(e) => setSpecialRequirements(e.target.value)}
        />
        <label>Description</label>
      </div>
      <button type="submit" className="basic-button">Save</button>
        </form>
        <button type="button" className="basic-button my-1" onClick={()=>navigate("/Events")}>Go Back</button>
    </main>)
}
export default EditEvent;