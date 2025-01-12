import React from 'react';
import 'tailwindcss/tailwind.css'; 

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-shift-blue text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Shift Solutions</h1>
      </header>
      
      <main className="flex-grow p-6">
        {children}  
      </main>
      
      <footer className="bg-shift-blue text-white py-4 text-center">
        <p>© 2025 ShiftSolutions. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MainLayout;
