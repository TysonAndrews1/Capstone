import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManagerDashboard from './screens/ManagerDashboard';
import MainLayout from './layouts/MainLayout'; 
import SignIn from './screens/SignIn';
import RegisterPage from './screens/RegisterPage';
import 'tailwindcss/tailwind.css';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ManagerDashboard" element={

          <MainLayout> 
            <ManagerDashboard />
          </MainLayout>

        }  />
      </Routes>
    </Router>
  );
}

export default App;


