import React, { useState } from "react";
import Sidebar1 from "../../components/UserFiles/Sidebar1";
import {Outlet} from "react-router-dom"

const Dashboard = () => {
    const [darkMode, setDarkMode] = useState(false);

  const mainContentClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50';
  const cardClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textClass = darkMode ? 'text-gray-300' : 'text-gray-600';
  const headingClass = darkMode ? 'text-white' : 'text-gray-800';
  const sidebarClass = darkMode ? 'bg-gray-800' : 'bg-black';
   const highlightClass = darkMode ? 'bg-indigo-700' : 'bg-black';
  const buttonClass = darkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-black hover:bg-gray-700 hover:cursor-pointer';
 // Toggle dark mode
 const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <div className={`flex h-screen ${mainContentClass}`}>
     <div className="flex-1 flex flex-row overflow-hidden">
         {/* Sidebar */}
      <Sidebar1/>
      <Outlet/>
     </div>
    </div>
  );
};

export default Dashboard;