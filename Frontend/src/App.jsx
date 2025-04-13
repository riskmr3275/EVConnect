import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Homepage from './components/Pages/Homepage';
import Navbar from './components/common/Navbar';
import Login from './components/Authenication/Login';
import EVDashboard from './components/UserFiles/EVDashboard';

function App() {
   

  return (
    <>
       <div className="min-h-screen bg-white">
             <Navbar/> 
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<EVDashboard />} />

              {/* <Route path="/" element={<Homepage />} /> */}

            </Routes>
       </div>
    </>
  )
}

export default App
