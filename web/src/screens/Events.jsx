import React, {useState} from "react";
import CalendarComponent from "../components/Calender";
import UpcomingEvents from "../components/UpcomingEvents";
import Overlay from "../components/Overlay";
import CreateShift from "../components/CreateShift";
import ScheduledShifts from "../components/ScheduledShifts";


export default function Events (){
    const [date, setDate]= useState(Date.now())

function dateSelected(date){
    console.log(date);
    setDate(date)
    
}

return(

<main>
<CalendarComponent onDateSelect={dateSelected} />
<Overlay child={<UpcomingEvents/>} headerTitle={"Upcoming Events"} ButtonTitle={"Upcoming Events"} buttonPlacement={"top-[75vh] left-[33vw]"}/>
<Overlay child={<ScheduledShifts selectedDate={date}/>} headerTitle={"Scheduled Shifts"} ButtonTitle={"Scheduled Shifts"} buttonPlacement={"top-[75vh] left-[10vw]"}/>
<Overlay child={<CreateShift/>} headerTitle={"Add Shift"} ButtonTitle={"Add Shift"} buttonPlacement={"top-[75vh] left-[55vw]"}/>
{/* <CalendarComponent OnDateSelect={dateSelected}/> */}

</main>)
}