import React, {useState} from "react";
import { useNavigate } from "react-router-dom";



export default function CreateEvent(eventId){
  let EditingEvent = ""
  let nextId = 1
  let loadEvent = () =>{}
    eventId? EditingEvent =loadEvent(eventId) : eventId = getNextId(nextId)

    const [error,SetError] = useState("")

    const [eventTitle, setEventTitle] = useState(EditingEvent.eventName ||'');
    const [startDate, setStartDate] = useState(EditingEvent.eventStartDate||new Date());
    const [endDate, setEndDate] = useState(EditingEvent.eventEndDate||new Date());
    const [location, setLocation] = useState(EditingEvent.eventLocation||'');
    const [numberOfGuests, setNumberOfGuests] = useState(EditingEvent.numberOfGuests||'');
    const [eventManager, setEventManager] = useState(EditingEvent.assignedManager||'');
    const [specialRequirements, setSpecialRequirements] = useState(EditingEvent.specialRequirements||'');

    const navigate = useNavigate();
    

  function getNextId(){

  }

    const handleSubmit = () => {
        if (!eventTitle || !startDate || !endDate || !location || !numberOfGuests || !eventManager) {
          alert("Error", "Please fill in all the fields");
          return;
        }

        const BASE_URL = ""
        const newEvent = {
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
            .then((data) => {
              alert("Success", "Event created successfully!");
              navigate('/Events');
            })
            .catch((error) => {
              console.error('Error creating event:', error);
              alert("Error", "Failed to create event");
            });
    }

    return(<main>
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
        </form>
    </main>)
}