import React, { useState } from 'react';
import Overlay from '../../components/Overlay';
import TradeShift from './TradeShift';
import ShiftDetails from '../../components/Shifts/ShiftDetails';
import ShiftGrabs from '../../components/Shifts/ShiftGrabs';



/**
 * Created by: Michelle Tran
 * The EmployeeSchedule component is the main screen for employees to view their schedule, trade shifts, and change availability.
 */ 
export default function EmployeeSchedule() {
    const [activeOverlay, setActiveOverlay] = useState(null)
  return (
    <main>

      <div className="flex flex-row justify-center">
      </div>

      {/* Will have a weekly calendar schedule view of the employee's schedule */}

      {/* Overlay for Grab Shift component */}
      <Overlay child={<ShiftGrabs/>} headerTitle={"Grab Shift"} ButtonTitle={"Grabs"} buttonPlacement={"top-[75vh] left-[25vw]"}
      isActive={activeOverlay === "Grab Shift"} onToggle={setActiveOverlay} />

      {/* Overlay for View Shift component */}
      <Overlay child={<ShiftDetails/>} headerTitle={"View Shift"} ButtonTitle={"View Shift"} buttonPlacement={"top-[75vh] left-[45vw]"}
      isActive={activeOverlay === "View Shift"} onToggle={setActiveOverlay}/>

      {/* Overlay for TradeShift component */}
      <Overlay child={<TradeShift/>} headerTitle={"Trade Request"} ButtonTitle={"Trade Request"} buttonPlacement={"top-[75vh] left-[75vw]"}
      isActive={activeOverlay === "Trade Request"} onToggle={setActiveOverlay}/>

      {/* Overlay for Change Availability component */}
      <Overlay child={<div>UpdateAvailability</div>} headerTitle={"Update Availability"} ButtonTitle={"Update Availability"} buttonPlacement={"top-[75vh] left-[10vw]"}
      isActive={activeOverlay === "Update Avaliability"} onToggle={setActiveOverlay}/>
    </main>
  
  )
}
