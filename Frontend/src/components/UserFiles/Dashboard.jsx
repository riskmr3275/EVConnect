import React, { useState } from "react";
import Sidebar1 from "../../components/UserFiles/Sidebar1";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className={`flex min-h-screen ${mainContentClass} w-full`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out lg:transition-none
        w-64 lg:w-auto
      `}>
        <Sidebar1 
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">EV Station</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            {darkMode ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;




// const Dashboard = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const mainContentClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50';

//   return (
//     <div className={`flex min-h-screen h-auto ${mainContentClass} overflow-y-auto`}>
//       <div className="flex-1 flex flex-row overflow-hidden">
//         {/* Sidebar */}
//         <Sidebar1 />
        
//         {/* Main Content */}
//         <div className="flex-1 overflow-y-auto">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };
