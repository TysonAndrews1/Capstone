import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './Styles.css'
import ManagerDashboard from './screens/manager/ManagerDashboard';
import MainLayout from './layouts/MainLayout'; 
import SignIn from './screens/SignIn';
import RegisterPage from './screens/RegisterPage';
import Events from './screens/Events';
import Home from './screens/Home';
import EmployeeSchedule from './screens/employee/EmployeeSchedule';
import Profile from './screens/employee/Profile';
import TradeShift from './screens/employee/TradeShift';
import EditEvent from './screens/EditEvent';
import ForgotPassword from './screens/ForgotPassword';
import ChatPage from './screens/Chat';
import Reports from './screens/manager/Reports';
import Vote from './screens/Vote';



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
        <Route path="/Reports" element={<MainLayout><Reports /></MainLayout>} />
        <Route path="/Chat" element={<MainLayout><ChatPage /></MainLayout>} />
        <Route path="/Vote" element={<MainLayout><Vote /></MainLayout>} />
        
      </Routes>
    </Router>
  );
}

export default App;


