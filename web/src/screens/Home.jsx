import React from "react";
// import { useNavigate } from "react-router-dom";

import WeeklyCalender from "../components/WeeklyCalender";
import Notification from "./NotificationTesting";
import { getCurrentUser } from "../components/FetchData";


//Created By Tyson
//The Home Page dedicated to future navigation of the page 

export default function Home(){
    getCurrentUser().then((user)=>{console.log(user)})
    return (

<div>
    <p>
This is the Home
</p>
<Notification/>
<WeeklyCalender/>
</div>)
}