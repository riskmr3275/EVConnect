import { Route, Routes } from "react-router-dom";
import Homepage from './components/Pages/Homepage';
import Login from './components/Authenication/Login';
import PrivateRoute from './components/Authenication/PrivateRoute';
import Dashboard from './components/UserFiles/Dashboard';
import Test from './components/UserFiles/Test';
import Test1 from './components/UserFiles/Test1';
import MyBookings from './components/UserFiles/MyBookings';
import Settings from './components/UserFiles/Settings';
import EVStationsPage from './components/OwnerDash/EVStationsPage';
import Dashboard1 from './components/OwnerDash/Dashboard1';
import TransactionsPage from './components/OwnerDash/TransactionsPage';
import AnalyticsPage from './components/OwnerDash/AnalyticsPage';
import EVChargingStationFinder from './components/UserFiles/EVChargingStationFinder';
import EmployeePage from './components/OwnerDash/EmployeePage';
import StationDashboard from './components/StationMaster/StationDashboard';
import ChargerMonitoring from './components/StationMaster/ChargerMonitoring';
import StationProfile from './components/StationMaster/StationProfile';
import EVAccessLogs from './components/StationMaster/EVAccessLogs';
import BookSlotPage from './components/UserFiles/BookSlotPage';
import StationDirectionPage from './components/UserFiles/StationDirectionPage';
import ProfileManagement from './components/UserFiles/ProfileManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
      <div className="min-h-full bg-white w-full overflow-visible ">
        
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
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
            <Route path="dashboard/transactions" element={<TransactionsPage />} />
            <Route path="dashboard/analytics" element={<AnalyticsPage />} />
            <Route path="dashboard/find" element={<EVChargingStationFinder />} />
            <Route path="dashboard/employees" element={<EmployeePage />} />
            <Route path="dashboard/stationMasterDashboard" element={<StationDashboard />} />
            <Route path="dashboard/monitor" element={<ChargerMonitoring />} />
            <Route path="/dashboard/stationprofile" element={<StationProfile />} />
            <Route path="/dashboard/accesslogs" element={<EVAccessLogs />} />
            <Route path="/dashboard/profile-management" element={<ProfileManagement />} />
            <Route path="/u/book-slot/:stationId" element={<BookSlotPage />} />
            <Route path="/u/get-direction" element={<StationDirectionPage />} />
          </Route>

        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  )
}

export default App
