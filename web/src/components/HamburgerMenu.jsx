import React, { useState } from 'react';

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Hamburger Icon */}
      <button
        className="block p-2"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        <span className="block w-6 h-1 bg-white mb-1"></span>
        <span className="block w-6 h-1 bg-white mb-1"></span>
        <span className="block w-6 h-1 bg-white "></span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <nav className="absolute top-12 left-0 bg-white w-full shadow-lg z-10">
          <ul className="flex flex-col items-start p-4">
            <li className="py-2 px-4">
              <a href="/Home" className="text-gray-800 hover:text-blue-500">
                Home
              </a>
            </li>
            <li className="py-2 px-4">
              <a href="/Events" className="text-gray-800 hover:text-blue-500">
                Events
              </a>
            </li>
            <li className="py-2 px-4">
              <a href="/ManagerDashboard" className="text-gray-800 hover:text-blue-500">
                Manager Dashboard
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default HamburgerMenu;
