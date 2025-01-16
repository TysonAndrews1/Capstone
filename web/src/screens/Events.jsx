import React from "react";
import CalendarComponent from "../components/Calender";
import UpcomingEvents from "../components/UpcomingEvents";
export default function Events (){

let something = 0

return(

<main>


<CalendarComponent OnDateSelect={something}/>
<UpcomingEvents/>
</main>)
}