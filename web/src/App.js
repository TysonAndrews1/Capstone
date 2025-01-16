import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManagerDashboard from './screens/ManagerDashboard';
import MainLayout from './layouts/MainLayout'; 
import SignIn from './screens/SignIn';
import RegisterPage from './screens/RegisterPage';
import ForgotPassword from './screens/ForgotPassword';
import Events from './screens/Events';
import CreateEvent from './screens/EditEvent';
import Home from './screens/Home';
import 'tailwindcss/tailwind.css';
import EmployeeSchedule from './screens/EmployeeSchedule';

function App() {
  return (
    /*This router component wraps the entire application to allow routing 
    in the app and navigate between different components based on the URL */
    <Router>
      <Routes> 
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ManagerDashboard" element={

          <MainLayout> 
            <ManagerDashboard />
          </MainLayout>

        }  />
        <Route path="/Events" element={<MainLayout> <Events /></MainLayout>}/>
        <Route path="/EditEvent" element={<MainLayout> <CreateEvent /></MainLayout>}/>
        <Route path = "/Home" element={<MainLayout><Home/></MainLayout>}></Route>

        <Route path="/EmployeeSchedule" element={<EmployeeSchedule />} />
      </Routes>
    </Router>
  );
}

export default App;


