import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import MiniShift from "./Shifts/MiniShift";
import Overlay from "./Overlay";
import CreateShift from "./CreateShift";
//Created By Tyson
//The Home Page dedicated to future navigation of the page 

export default function ScheduledShifts({selectedDate}){
    const [activeOverlay,setActiveOverlay] = useState(null)
return (
<div>
<p>
ScheduledShifts

</p>
<MiniShift employeeId={1}/>
<label>Notifiy 48 hours before Shift</label><button type="button">here</button>
<Overlay child={<CreateShift/>} headerTitle={"Create Shift"} ButtonTitle={"Create Shift"} buttonPlacement={"top-[75vh] left-[5vw]"} isActive={activeOverlay === "Create Shift"} onToggle={setActiveOverlay}/>
</div>)
}