import React, { useState } from "react";


/* overlay Component
* Created By Tyson
* Used the Assistance of Chat-GPT to Fix Z fighting and some multiple overlay issues
*/


export default function Overlay({ child, headerTitle, ButtonTitle, buttonPlacement, isActive, onToggle }) {
  function closeOverlay() {
    onToggle(false); // Pass null to close the overlay
  }

  const toggleSidebar = () => {
    onToggle(isActive ? null : headerTitle); // Toggle active state based on the headerTitle
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        className={` basic-button ${buttonPlacement} z-10`} // Ensure button has lower z-index than overlay
      >
        {ButtonTitle}
      </button>

      {/* SideBar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-slate-400 transform ${
          isActive ? "-translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-20`} // Overlay always above the button
      >
        <header className="bg-hover-blue text-white py-4 px-6 flex items-center">
          <button
            className="block p-2"
            onClick={closeOverlay}
            aria-label="Toggle Menu"
          >
            <span className="block w-6 h-1 bg-white mb-1"></span>
            <span className="block w-6 h-1 bg-white mb-1"></span>
            <span className="block w-6 h-1 bg-white "></span>
          </button>
          <h1 className="text-2xl font-bold ml-4">{headerTitle}</h1>
        </header>
        <div className="overflow-y-auto h-[calc(100%-64px)] px-4 py-4">
          {child}
        </div>
      </div>
    </div>
  );
}