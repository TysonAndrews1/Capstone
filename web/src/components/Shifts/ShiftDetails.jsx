import React from "react";
import { useNavigate } from "react-router-dom";


export default function shiftDetails({shift,editing}){

return (

<div>
    <p>First Name: {shift.firstName}</p>
    <p>Start Time: {shift.shiftStartDate}</p>
    <p>End Time: {shift.shiftEndDate}</p>
    <p>Description: {shift.description}</p>
</div>)
}