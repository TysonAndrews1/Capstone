import React from "react";
import { useNavigate } from "react-router-dom";

import WeeklyCalender from "../components/WeeklyCalender";
import Notification from "./NotificationTesting";


//Created By Tyson
//The Home Page dedicated to future navigation of the page 

export default function Home(){
return (

<div>
    <p>
This is the Home
</p>
<Notification/>
<WeeklyCalender/>
{/* <Overlay child={<Roster/>} headerTitle={"View Roster"} ButtonTitle={"View Roster"} buttonPlacement={"top-[75vh] left-[55vw]"} isActive={activeOverlay === "View Roster"} onToggle={setActiveOverlay}/> */}

</div>)
}