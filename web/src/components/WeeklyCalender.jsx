import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import UpcomingEvents from "./UpcomingEvents";
import MiniShift from "./Shifts/MiniShift";
import ShiftDetails from "./Shifts/ShiftDetails";
import Overlay from "./Overlay";
import Roster from "./Roster";
import EditEvent from "../screens/EditEvent";
import CreateAnnouncement from "./CreateAnnouncment";
export default function WeeklyCalender(){
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split("T")[0])
    const [activeOverlay,setActiveOverlay] =useState(false)
    const navigate = useNavigate()

    const CreateEvent = () =>{
        navigate(`/EditEvent/${null}`)
    }
  // Function to move the target date backward by 7 days
  const moveBackward = () => {
    const newDate = new Date(targetDate);
    newDate.setDate(newDate.getDate() - 7);
    setTargetDate(newDate.toISOString().split("T")[0]);
  };

  // Function to move the target date forward by 7 days
  const moveForward = () => {
    const newDate = new Date(targetDate);
    newDate.setDate(newDate.getDate() + 7);
    setTargetDate(newDate.toISOString().split("T")[0]);
  };

  const getRecentSunday = (date) => {
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay(); // Sunday is 0, Monday is 1, etc.
    currentDate.setDate(currentDate.getDate() - dayOfWeek); // Move back to the most recent Sunday
    return currentDate;
  };

  // Calculate the most recent Sunday to display the week
  const recentSunday = getRecentSunday(targetDate);

    // Generate 7 days starting from the target date
    const getWeekDays = () => {
        const weekDays = [];
        const baseDate = new Date(recentSunday);
        for (let i = 0; i < 7; i++) {
          const day = new Date(baseDate);
          day.setDate(baseDate.getDate() + i);
          weekDays.push(day.toISOString().split("T")[0]);
        }
        return weekDays;
      };
    
      const weekDays = getWeekDays();



    return(
<div className=" flex-grow w-full">
<div className="flex justify-between items-center py-4 bg-gray-100 border-b">
        <button 
          onClick={moveBackward} 
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
        >
          Backward
        </button>
        <p className="text-xl font-semibold">
          Week: {weekDays[0]} to {weekDays[6]} | Current Day: {targetDate}
        </p>
        <button 
          onClick={moveForward} 
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
        >
          Forward
        </button>
      </div>
              {/* Weekly Calendar */}
      <div className="flex flex-nowrap justify-between items-stretch mt-4 h-[70vh]">
        {weekDays.map((day) => (
          <div
            key={day}
            className="flex-1 flex flex-col items-center justify-center border  p-4 bg-gray-200 rounded shadow-md min-w-[12%] max-w-[14%]"
          >
            <p className="font-bold text-lg mb-2">{new Date(day).toDateString()}</p>
            <div className="flex-1 w-full">
              <UpcomingEvents selectedDay={new Date(day)}/>
              <MiniShift selectedDay={new Date(day)}/>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 py-4 text-center bg-gray-100 border-t">
        <p className="text-sm text-gray-500">Footer (if needed)</p>
        <Overlay  headerTitle ={"Create Event"} ButtonTitle={"Create Event"} buttonPlacement={"top-[66vh] left-[33vw]"} isActive={activeOverlay=="Create Event"} 
        onToggle={setActiveOverlay} child= {<EditEvent eventId={null}/>}/>
        <Overlay  headerTitle ={"Create Shift"} ButtonTitle={"Create Shift"} buttonPlacement={"top-[75vh] left-[33vw]"} isActive={activeOverlay=="Create Shift"} 
        onToggle={setActiveOverlay} child= {<ShiftDetails/>}/>
        <Overlay  headerTitle ={"Roster"} ButtonTitle={"Roster"} buttonPlacement={"top-[75vh] left-[50vw]"} isActive={activeOverlay== "Roster"} 
        onToggle={setActiveOverlay} child= {<Roster/>}/>
                <Overlay  headerTitle ={"Create Announcement"} ButtonTitle={"Create Announcement"} buttonPlacement={"top-[75vh] left-[50vw]"} isActive={activeOverlay== "Create Announcement"} 
        onToggle={setActiveOverlay} child= {<CreateAnnouncement/>}/>
      </div>
    </div>
)
}