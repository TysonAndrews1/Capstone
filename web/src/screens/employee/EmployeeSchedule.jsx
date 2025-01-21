import React, { useState } from 'react';
import Overlay from '../../components/Overlay';
import TradeShift from './TradeShift';



/**
 * Created by: Michelle Tran
 * The EmployeeSchedule component is the main screen for employees to view their schedule, trade shifts, and change availability.
 */ 
export default function EmployeeSchedule() {

  return (
    <main>

      <div className="flex flex-row justify-center">
      </div>

      {/* Will have a weekly calendar schedule view of the employee's schedule */}

      {/* Overlay for Grab Shift component */}
      <Overlay child={<div>GrabShift</div>} headerTitle={"Grab Shift"} ButtonTitle={"Grabs"} buttonPlacement={"top-[75vh] left-[25vw]"}/>

      {/* Overlay for View Shift component */}
      <Overlay child={<div>ViewShift</div>} headerTitle={"View Shift"} ButtonTitle={"View Shift"} buttonPlacement={"top-[75vh] left-[45vw]"}/>

      {/* Overlay for TradeShift component */}
      <Overlay child={<TradeShift/>} headerTitle={"Trade Request"} ButtonTitle={"Trade Request"} buttonPlacement={"top-[75vh] left-[75vw]"}/>

      {/* Overlay for Change Availability component */}
      <Overlay child={<div>UpdateAvailability</div>} headerTitle={"Update Availability"} ButtonTitle={"Update Availability"} buttonPlacement={"top-[75vh] left-[10vw]"}/>
    </main>
  
  )
}
