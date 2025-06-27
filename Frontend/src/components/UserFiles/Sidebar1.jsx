import React, { useState } from 'react';
import { LogOut, Search, Calendar, Home, Settings, Car, BarChart2, Users, DollarSign, ClipboardList } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // For navigating between routes
import {logout} from "../../services/operations/authAPI"
import { useDispatch } from 'react-redux';
const Sidebar1 = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const sidebarClass = darkMode ? 'bg-gray-800' : 'bg-black';
  const navigate = useNavigate(); // To navigate to the respective route

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderTabs = () => {
    if (!user) return null;

    const commonTabs = [
      {
        name: 'settings',
        label: 'Settings',
        icon: <Settings className="mr-3" size={18} />,
        route: '/dashboard/settings'
      }
    ];

    const logoutTab = {
      name: 'logout',
      label: 'Logout',
      icon: <LogOut className="mr-3" size={18} />,
      special: true,
      route: '/logout'
    };

    let tabs = [];

    if (user.accountType === 'USER') {
      tabs = [
        { name: 'findev', label: 'Find', icon: <Search className="mr-3" size={18} />, route: '/dashboard/find' },
        { name: 'dashboard', label: 'Dashboard', icon: <Home className="mr-3" size={18} />, route: '/dashboard/userDashboard' },
        { name: 'mybookings', label: 'My Bookings', icon: <Calendar className="mr-3" size={18} />, route: '/dashboard/addCv' },
        { name: 'addev', label: 'Add Your EV', icon: <Car className="mr-3" size={18} />, route: '/dashboard/Booking' },
        ...commonTabs,
      ];
    } else if (user.accountType === 'OWNER') {
      tabs = [
        { name: 'dashboard', label: 'Dashboard', icon: <Home className="mr-3" size={18} />, route: '/dashboard/ownerDashboard' },
        { name: 'station', label: 'Stations', icon: <ClipboardList className="mr-3" size={18} />, route: '/dashboard/station' },
        { name: 'transactions', label: 'Transactions', icon: <DollarSign className="mr-3" size={18} />, route: '/dashboard/transactions' },
        { name: 'employees', label: 'Employees', icon: <Users className="mr-3" size={18} />, route: '/dashboard/employees' },
        { name: 'analytics', label: 'Analytics', icon: <BarChart2 className="mr-3" size={18} />, route: '/dashboard/analytics' },
        ...commonTabs,
      ];
    } else if (user.accountType === 'STATIONMASTER') {
      tabs = [
        { name: 'dashboard', label: 'Master Dashboard', icon: <Home className="mr-3" size={18} />, route: '/dashboard/stationMasterDashboard' },
         { name: 'monitorcharger', label: 'Monitor Chargers', icon: <ClipboardList className="mr-3" size={18} />, route: '/dashboard/monitor' },
        { name: 'stationprofile', label: 'Station Profile', icon: <ClipboardList className="mr-3" size={18} />, route: '/dashboard/stationprofile' },
        { name: 'accesslogs', label: 'Access Logs', icon: <ClipboardList className="mr-3" size={18} />, route: '/dashboard/accesslogs' },

        { name: 'supportTickets', label: 'Support Tickets', icon: <Users className="mr-3" size={18} />, route: '/dashboard/supportTickets' },
        ...commonTabs,
      ];
    }

    tabs.push(logoutTab);
    return tabs;
  };

  const tabs = renderTabs();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`${sidebarClass} w-80 flex-shrink-0 hidden md:block h-full border-r-1 border-white overflow-x-hidden`}>
        <div className="p-4">
          <nav>
            <ul className="space-y-2 p-2 rounded-2xl h-full">
              {tabs?.map((tab) => (
                <li key={tab.name}>
                  <button
                    onClick={() => {
                      if (tab.name === 'logout') {
                        console.log('Logout clicked');
                        dispatch(logout(navigate));
                        // Add logout functionality here if necessary
                      } else {
                        setActiveTab(tab.name);
                        navigate(tab.route); // Navigate to the selected route
                      }
                    }}
                    className={`cursor-pointer flex items-center w-full py-2 px-4 rounded-lg ${tab.name === activeTab ? 'bg-white text-black' : tab.special ? 'text-red-600 hover:cursor-pointer hover:text-red-900' : 'text-gray-300 hover:bg-gray-500 hover:cursor-pointer '}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`${sidebarClass} w-16 flex-shrink-0 md:hidden flex flex-col items-center py-4`}>
        <div className="space-y-4">
          {tabs?.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                if (tab.name === 'logout') {
                  console.log('Logout clicked');
                  dispatch(logout(navigate));
                  // Add logout functionality here if necessary
                } else {
                  setActiveTab(tab.name);
                  navigate(tab.route); // Navigate to the selected route
                }
              }}
              className={`p-3 rounded-full ${tab.name === activeTab ? 'bg-indigo-900' : 'hover:bg-indigo-600'}`}
            >
              {React.cloneElement(tab.icon, { color: 'white', size: 20, className: '' })}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar1;
