import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css'; 
import HamburgerMenu from '../components/HamburgerMenu';
import { FaRegCircleUser } from 'react-icons/fa6'; 
import NotificationMenu from '../components/NotificationMenu';



/**
 * Created by: Michelle Tran, Tyson
 * The MainLayout component wraps the entire application to provide a consistent layout across all screens.

 */
function MainLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false)
  const navigate = useNavigate();

/**
 * Reference: OpenAI, "ChatGPT," Personal Communication, Feb 2, 2025.
 * Prompt: "Update the UI to adjust the sidebar menu and the main content area to dynamically adjust when the sidebar is toggled."
 */
  return (
    // Ternary Operator used as a shorthand for writing conditional statements - apply the left ('ml-64') if the condition is true, otherwise apply the right ('ml-0')
    <div className={`min-h-screen flex flex-col bg-gray-100 transition-all duration-300 ${menuOpen ? 'ml-64' : 'ml-0'}`}>
      <header className="bg-hover-blue text-white py-4 px-6 flex items-center justify-between"> 

        <div className="flex items-center">
          <HamburgerMenu setMenuOpen={setMenuOpen} /> 
          <h1 className="text-2xl font-bold ml-4 cursor-pointer" // Added cursor-pointer to make the cursor convert to a pointer when hovering over the name. 
          onClick={() => navigate('/home')}>Shift Solutions</h1>
        </div>
        <div className=''>
        <button className="text-white text-3xl mr-4 "
          onClick={() => navigate('/profile')}>
          <FaRegCircleUser />
        </button>
        <button className='text-white text-3xl'>
          <NotificationMenu/>
        </button>
        </div>

      </header>
      
      <main className="flex-grow p-6">
        {children}  
      </main>
      
      <footer className="bg-hover-blue text-white py-4 text-center">
        <p>© 2025 ShiftSolutions. All rights reserved.</p>
      </footer>

    </div>
  );
}



export default MainLayout;
