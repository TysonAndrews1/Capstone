import React from 'react';
import './Styles.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './screens/SignIn';
import ForgotPassword from './screens/ForgotPassword';
import MainLayout from './layouts/MainLayout';
import Home from './screens/Home';
import ManagerDashboard from './screens/manager/ManagerDashboard';
import Events from './screens/Events'; 
import EditEvent from './screens/EditEvent';
import EmployeeSchedule from './screens/employee/EmployeeSchedule';
import TradeShift from './screens/employee/TradeShift';
import Profile from './screens/employee/Profile';
import RegisterPage from './screens/RegisterPage';


function App() {
  return (
    /*This router component wraps the entire application to allow routing 
    in the app and navigate between different components based on the URL */
    <Router>
      <Routes> 
        <Route path="/" element={<SignIn />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ManagerDashboard" element={<MainLayout> <ManagerDashboard /></MainLayout>
        }  />
        <Route path="/Events" element={<MainLayout> <Events /></MainLayout>}/>
        <Route path="/EditEvent/:eventId" element={<MainLayout> <EditEvent /></MainLayout>}/>
        <Route path = "/Home" element={<MainLayout><Home/></MainLayout>}></Route>
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />

        <Route path="/EmployeeSchedule" element={<MainLayout><EmployeeSchedule /></MainLayout>} />
        <Route path="/TradeShift/:accountId" element={<MainLayout><TradeShift /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;


