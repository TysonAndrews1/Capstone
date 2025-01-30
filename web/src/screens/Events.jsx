import React, {useState} from "react";
import CalendarComponent from "../components/Calender";
import UpcomingEvents from "../components/UpcomingEvents";
import Overlay from "../components/Overlay";
import CreateShift from "../components/CreateShift";
import ScheduledShifts from "../components/ScheduledShifts";
import EditEvent from "./EditEvent";


export default function Events (){
    const [date, setDate]= useState(new Date())
    const [activeOverlay, setActiveOverlay] = useState(null)
    
function dateSelected(date){
    console.log(date);
    setDate(date)
    
}

return(

<main>
<CalendarComponent onDateSelect={dateSelected} />
<Overlay child={<UpcomingEvents selectedDay={date}/>} headerTitle={"Upcoming Events"} ButtonTitle={"Upcoming Events"} buttonPlacement={"top-[75vh] left-[33vw]"}  
            isActive={activeOverlay === "Upcoming Events"} onToggle={setActiveOverlay}/>
<Overlay child={<ScheduledShifts selectedDate={date}/>} headerTitle={"Scheduled Shifts"} ButtonTitle={"Scheduled Shifts"} buttonPlacement={"top-[75vh] left-[10vw]"} 
            isActive={activeOverlay === "Scheduled Shifts"}
        onToggle={setActiveOverlay}/>
<Overlay child={<CreateShift/>} headerTitle={"Add Shift"} ButtonTitle={"Add Shift"} buttonPlacement={"top-[75vh] left-[55vw]"} 
            isActive={activeOverlay === "Add Shift"} 
        onToggle={setActiveOverlay}/>
        <Overlay child={<EditEvent eventId={null}/>} headerTitle={"Create Event"} ButtonTitle={"Create Event"} buttonPlacement={"top-[90vh] left-[55vw]"} 
            isActive={activeOverlay === "Create Event"} 
        onToggle={setActiveOverlay}/>
</main>)
}