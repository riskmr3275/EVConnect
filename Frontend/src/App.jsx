import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Homepage from './components/Pages/Homepage';
import Navbar from './components/common/Navbar';
import Login from './components/Authenication/Login';
import EVDashboard from './components/UserFiles/EVDashboard';
import PrivateRoute from './components/Authenication/PrivateRoute';
import Dashboard from './components/UserFiles/Dashboard';
import Test from './components/UserFiles/Test';
import Test1 from './components/UserFiles/Test1';
import MyBookings from './components/UserFiles/MyBookings';
import Settings from './components/UserFiles/Settings';
import OwnDashboardPage from './components/OwnerDash/OwnDashboardPage';
import EVStationsPage from './components/OwnerDash/EVStationsPage';
import EVChargingStationFinder from './components/UserFiles/EVChargingStationFinder';
function App() {
   

  return (
    <>
       <div className="min-h-screen bg-white">
            <Navbar/> 
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="/dashboard" element={<EVDashboard />} /> */}

              <Route
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            >
              <Route path="dashboard/userDashboard" element={<Test />} />
               <Route path="dashboard/Booking" element={<Test1 />} />
             <Route path="/dashboard/addCv" element={<MyBookings />} />
              <Route path="dashboard/settings" element={<Settings />} />  
              <Route path="dashboard/ownerDashboard" element={<OwnDashboardPage />} />  
              <Route path="dashboard/station" element={<EVStationsPage />} /> 
              <Route path="dashboard/find" element={<EVChargingStationFinder />} />  
            </Route>

            </Routes>
       </div>
    </>
  )
}

export default App
