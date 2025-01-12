import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManagerDashboard from './screens/ManagerDashboard';
import MainLayout from './layouts/MainLayout'; 
import 'tailwindcss/tailwind.css';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" 
        element={
          <MainLayout> 
            <ManagerDashboard />
          </MainLayout>
        } 
        />

      </Routes>
    </Router>
  );
}

export default App;


