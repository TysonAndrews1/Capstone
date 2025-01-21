import React, {useState,useEffect}from "react";
import { useNavigate } from "react-router-dom";
import EventBar from "./EventBar";

const MainLayout = ({ children }) => {
    return <div className="main-layout">{children}</div>;
  };

export default function UpcomingEvents(){
    const [selectedOption, setSelectedOption] = useState('upcoming');  // Default to 'upcoming'
    const [events, setEvents] = useState([]); // State to store events from the backend
    const [error, setError] = useState(null); // State for error handling
    const navigate = useNavigate();
    const BASE_URL =  'http://localhost:8080/api/events';
  
    // Function to fetch events from the backend
    const fetchEvents = async (timeframe) => {
    
      setError(true); // Reset error state
      try {
        const response = await fetch(`${BASE_URL}/filter?timeframe=${timeframe}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data); // Update the state with the fetched events
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Please try again later.');
      }
    };
  
    // Fetch events whenever the selected option changes
    useEffect(() => {
      fetchEvents(selectedOption);
    }, [selectedOption]);
  
    // Handle selection change
    const handleSelect = (option) => {
      setSelectedOption(option);
    };
    const CreateEvent = () =>{
        navigate(`/EditEvent/${null}`)
    }
    
    return (
            <MainLayout>
              <div className="container">
                <div className="options-container">
                  {/* Past Events Option */}
                  <button 
                    className={`option ${selectedOption === 'past' ? 'selected-option' : ''}`} 
                    onClick={() => handleSelect('past')}
                  >
                    <span className={`option-text ${selectedOption === 'past' ? 'selected-text' : ''}`}>
                      Past Events
                    </span>
                    {selectedOption === 'past' && <div className="underline" />}
                  </button>
        
                  {/* Constant underline */}
                  <div className="constant-underline" />
        
                  {/* Upcoming Events Option */}
                  <button 
                    className={`option ${selectedOption === 'upcoming' ? 'selected-option' : ''}`} 
                    onClick={() => handleSelect('upcoming')}
                  >
                    <span className={`option-text ${selectedOption === 'upcoming' ? 'selected-text' : ''}`}>
                      Upcoming Events
                    </span>
                    {selectedOption === 'upcoming' && <div className="underline" />}
                  </button>
                </div>
        
                {/* Scrollable Event List */}
                <div className="event-list">
                  <EventBar events={events} filterType={selectedOption} />
                </div>
        
                {/* Create New Event Button */}
                <button className="button" onClick={CreateEvent}>
                  Create New Event
                </button>
              </div>
            </MainLayout>
          );
  }