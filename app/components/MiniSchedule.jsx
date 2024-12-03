import React from "react";



export default function MiniSchedule(){


<<<<<<< Updated upstream
=======
export default function MiniSchedule({EventName,EventStartTime,eventType}){
 const Months =["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sept","Oct","Nov","Dec"]
const date = new Date(EventStartTime)
const MonthNumber = date.getMonth()
const day = date.getDate()
let weekday =  date.toLocaleDateString('en-US', { weekday: 'long' }).slice(0,3);
let Month = Months[MonthNumber]
>>>>>>> Stashed changes
    return(
        <></>
    )
}