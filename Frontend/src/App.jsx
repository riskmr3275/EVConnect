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
// import OwnDashboardPage from './components/OwnerDash/OwnDashboardPage';
import EVStationsPage from './components/OwnerDash/EVStationsPage';
import Dashboard1 from './components/OwnerDash/Dashboard1';
import EVChargingStationFinder from './components/UserFiles/EVChargingStationFinder';
import EmployeePage from './components/OwnerDash/EmployeePage';
import StationDashboard from './components/StationMaster/StationDashboard';
import ChargerMonitoring from './components/StationMaster/ChargerMonitoring';
import StationProfile from './components/StationMaster/StationProfile';
import EVAccessLogs from './components/StationMaster/EVAccessLogs';
import BookSlotPage from './components/UserFiles/BookSlotPage';
import StationDirectionPage from './components/UserFiles/StationDirectionPage';
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
              {/* <Route path="dashboard/ownerDashboard" element={<OwnDashboardPage />} />  */}
              <Route path="dashboard/ownerDashboard" element={<Dashboard1 />} />  
 
              <Route path="dashboard/station" element={<EVStationsPage />} /> 
              <Route path="dashboard/find" element={<EVChargingStationFinder />} />  
              <Route path="dashboard/employees" element={<EmployeePage />} />
              <Route path="dashboard/stationMasterDashboard" element={<StationDashboard />} />
              <Route path="dashboard/monitor" element={<ChargerMonitoring />} />
              <Route path="/dashboard/stationprofile" element={<StationProfile/>} />
              <Route path="/dashboard/accesslogs" element={<EVAccessLogs/>} />
              <Route path="/u/book-slot/:stationId" element={<BookSlotPage/>} />
              <Route path="/u/get-direction" element={<StationDirectionPage/>} />



            </Route>

            </Routes>
       </div>
    </>
  )
}

export default App
