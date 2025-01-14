import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManagerDashboard from './screens/ManagerDashboard';
import MainLayout from './layouts/MainLayout'; 
import SignIn from './screens/SignIn';
import RegisterPage from './screens/RegisterPage';
import ForgotPassword from './screens/ForgotPassword';
import Events from './screens/Events';
import CreateEvent from './screens/EditEvent';
import 'tailwindcss/tailwind.css';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ManagerDashboard" element={

          <MainLayout> 
            <ManagerDashboard />
          </MainLayout>

        }  />
        <Route path="/Events" element={<MainLayout> <Events /></MainLayout>}/>
        <Route path="/EditEvent" element={<MainLayout> <CreateEvent /></MainLayout>}/>
      </Routes>
    </Router>
  );
}

export default App;


