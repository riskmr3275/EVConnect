import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Homepage from './componts/Pages/Homepage';
import Navbar from './componts/common/Navbar';
import Login from './componts/Authenication/Login';

function App() {
   

  return (
    <>
       <div className="min-h-screen bg-white">
             <Navbar/> 
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />

              {/* <Route path="/" element={<Homepage />} /> */}

            </Routes>
       </div>
    </>
  )
}

export default App
