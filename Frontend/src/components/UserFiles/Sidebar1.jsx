import React, { useState } from 'react';
import { LogOut, Search, Calendar, Home, Settings, Car, BarChart2, Users, DollarSign, ClipboardList, X, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../services/operations/authAPI";
import { useDispatch } from 'react-redux';

const Sidebar1 = ({ darkMode, toggleDarkMode, sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useSelector((state) => state.profile);
  const sidebarClass = darkMode ? 'bg-gray-800' : 'bg-black';
  const navigate = useNavigate();

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

  const handleNavigation = (tab) => {
    if (tab.name === 'logout') {
      dispatch(logout(navigate));
    } else {
      setActiveTab(tab.name);
      navigate(tab.route);
      // Close mobile sidebar after navigation
      if (setSidebarOpen) {
        setSidebarOpen(false);
      }
    }
  };

  return (
    <div className={`${sidebarClass} h-full flex flex-col`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-lg font-semibold">EV Station</h2>
              <p className="text-xs text-gray-400 capitalize">{user?.accountType?.toLowerCase()}</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen && setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-gray-400 text-sm truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {tabs?.map((tab) => (
            <li key={tab.name}>
              <button
                onClick={() => handleNavigation(tab)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  tab.name === activeTab 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : tab.special 
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">
                  {React.cloneElement(tab.icon, { 
                    size: 20, 
                    className: 'mr-3',
                    color: tab.name === activeTab ? 'white' : tab.special ? 'currentColor' : 'currentColor'
                  })}
                </span>
                <span className="font-medium">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-gray-400 text-sm">
          <span>© 2024 EV Station</span>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar1;
