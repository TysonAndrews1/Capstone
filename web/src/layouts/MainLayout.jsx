import React from 'react';
import 'tailwindcss/tailwind.css'; 
import HamburgerMenu from '../components/HamburgerMenu';
import { FaRegCircleUser } from 'react-icons/fa6'; 
import { useNavigate } from 'react-router-dom';


/**
 * Created by: Michelle Tran
 * The MainLayout component wraps the entire application to provide a consistent layout across all screens.
 * 
 */
function MainLayout({ children }) {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-hover-blue text-white py-4 px-6 flex items-center justify-between"> 
        <div className="flex items-center">
          <HamburgerMenu />
          <h1 className="text-2xl font-bold ml-4">Shift Solutions</h1>
        </div>
        <button className="text-white text-3xl"
        onClick={() => navigate('/profile')}>
          <FaRegCircleUser />
        </button>
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
