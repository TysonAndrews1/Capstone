import React from "react";
import { useNavigate } from "react-router-dom";
import Overlay from "../components/Overlay";
import Roster from "../components/Roster";

//Created By Tyson
//The Home Page dedicated to future navigation of the page 

export default function Home(){

return (

<div>
    <p>
This is the Home
</p>
<Overlay child={<Roster/>} headerTitle={"View Roster"} ButtonTitle={"View Roster"} buttonPlacement={"top-[75vh] left-[55vw]"}/>

</div>)
}