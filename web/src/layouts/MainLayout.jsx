import React from 'react';
import 'tailwindcss/tailwind.css'; 
import HamburgerMenu from '../components/HamburgerMenu';

// Created by 
// The Main Layout making sure to add the header and footer too all pages that require it 

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-hover-blue text-white py-4 px-6 flex items-center">
        <HamburgerMenu />
        <h1 className="text-2xl font-bold ml-4">Shift Solutions</h1> 
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
