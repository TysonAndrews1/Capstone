import React, { useState } from 'react';


function HamburgerMenu({ setMenuOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setMenuOpen(!isOpen)
  };

  return (
    <div className="relative-flex">

      {/*Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-20 w-64 transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-64'} transition-transform duration-300 ease-in-out`}>
          <button
            className="absolute top-4 right-4 p-2 bg-gray-300 rounded-full"
            onClick={toggleMenu}
            aria-label="Close Menu"
          >
            X
          </button>

        <nav className="mt-16 p-4">
          <ul className="flex flex-col space-y-4">
          <li><a href="/Home" className="text-gray-800 hover:text-blue-500">Home</a></li>
          <li><a href="/Events" className="text-gray-800 hover:text-blue-500">Events</a></li>
          <li><a href="/ManagerDashboard" className="text-gray-800 hover:text-blue-500">Manager Dashboard</a></li>
          <li><a href="/employeeschedule" className="text-gray-800 hover:text-blue-500">Employee Schedule</a></li>
          <li><a href="/" className="text-gray-800 hover:text-blue-500">Log Out</a></li>
          </ul>
        </nav>
      </div>

        {/* Hamburger Icon */}
        <button
          className="p-2 z-30"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white"></span>
        </button>
    </div>
  );
}

export default HamburgerMenu;




