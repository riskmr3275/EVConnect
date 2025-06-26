import React, { useState, useEffect, use } from 'react';
import { Plus, X } from 'lucide-react';
import { apiConnector } from '../../services/apiconnector';
import { useSelector,useDispatch } from 'react-redux';
import {stationEndpoints} from '../../services/api'
import { addEmployees } from '../../services/operations/OwnerApi';
export default function EmployeePage() {
  const dispatch=useDispatch()
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [allStation,setAllStation]=useState([])
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    setPassword: '',
    confirmPassword: '',
    contactNumber: '',
    accountType: 'STATIONMASTER',
    gender: '',
    dateOfBirth: '',
    stationId: '',
    shift: '',
  });

  const stationsWithoutManagers = ['Highway Rest Stop', 'Airport Terminal', 'University Campus'];

  // 💾 Temporary dummy data
  useEffect(() => {
    const dummyEmployees = [
      {
        name: 'Alice Johnson',
        email: 'alice@evcharge.com',
        phone: '+1 (555) 123-4567',
        station: 'Downtown Station',
        joinDate: '6/15/2023',
        shift: 'Morning (6AM–2PM)'
      },
      {
        name: 'Bob Smith',
        email: 'bob@evcharge.com',
        phone: '+1 (555) 234-5678',
        station: 'Mall Parking',
        joinDate: '8/20/2023',
        shift: 'Evening (2PM–10PM)'
      },
      {
        name: 'Carol Davis',
        email: 'carol@evcharge.com',
        phone: '+1 (555) 345-6789',
        station: 'Office Complex',
        joinDate: '9/10/2023',
        shift: 'Full Day (8AM–6PM)'
      }
    ];
    setEmployees(dummyEmployees);
  }, []);

  const fetchAllStations = async () => {
    try {
      const response = await apiConnector("GET", stationEndpoints.GET_ALL_STATION);
      return response.data.data;
    } catch (err) {
      console.error("Error fetching stations:", err);
      return [];
    }
  };
  
  useEffect(() => {
    fetchAllStations().then((data) => {
      setAllStation(data);
      // console.log("Stations inside then:", data);
    });
  }, []);

  const handleAddEmployee = () => {
    setEmployees([...employees, newEmployee]);
    if (newEmployee.setPassword !== newEmployee.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      station: '',
      joinDate: '',
      shift: ''
    });
    dispatch(addEmployees(newEmployee,token))
    console.log("object from newEnoiir",newEmployee)
    setShowModal(false);
  };
  
  return (
    <div className="p-8 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-gray-600">Manage your team and station assignments</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {/* ⚠️ Yellow Alert Box */}
      <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 p-4 rounded-lg">
        <strong>Stations Without Managers</strong>
        <p className="mt-1 text-sm">The following stations don't have assigned managers:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {stationsWithoutManagers.map((station) => (
            <span key={station} className="bg-yellow-200 text-sm px-3 py-1 rounded-full">
              {station}
            </span>
          ))}
        </div>
      </div>

      {/* 🔍 Filters */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search employees by name, email, or station..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
        />
        <select className="border px-3 py-2 rounded-md">
          <option>All Roles</option>
          <option>Manager</option>
          <option>Staff</option>
        </select>
        <select className="border px-3 py-2 rounded-md">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* 👨‍💼 Employee Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {employees.map((emp, i) => (
          <div key={i} className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold">{emp.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-black text-white px-2 py-0.5 rounded">Manager</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Active</span>
            </div>
            <p className="text-sm mt-2">{emp.email}</p>
            <p className="text-sm">{emp.phone}</p>
            <p className="text-sm">{emp.station}</p>
            <p className="text-sm mt-2">Joined: {emp.joinDate}</p>
            <p className="text-sm">Shifts: {emp.shift}</p>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 border rounded-md text-sm">Edit</button>
              <button className="px-3 py-1 border rounded-md text-sm">Assign</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
  <div className="fixed inset-0 bg-black/80   z-50 flex items-center justify-center overflow-auto">
    <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-lg relative">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-black"
        onClick={() => setShowModal(false)}
      >
        <X size={20} />
      </button>

      <h2 className="text-2xl font-semibold mb-6 text-center">Add New Employee</h2>

      <form className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-medium">Full Name</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded-md px-3 py-2"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Set Password</label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2"
              value={newEmployee.setPassword}
              onChange={(e) => setNewEmployee({ ...newEmployee, setPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2"
              value={newEmployee.confirmPassword}
              onChange={(e) => setNewEmployee({ ...newEmployee, confirmPassword: e.target.value })}
            />
          </div>
        </div>

        {/* Contact Number */}
        <div>
          <label className="block mb-1 text-sm font-medium">Contact Number</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={newEmployee.contactNumber}
            onChange={(e) => setNewEmployee({ ...newEmployee, contactNumber: e.target.value })}
          />
        </div>

        {/* Role + Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Role</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={newEmployee.accountType}
              onChange={(e) => setNewEmployee({ ...newEmployee, accountType: e.target.value })}
            >
              <option value="Manager">Manager</option>
              <option value="Station Master">Station Master</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Gender</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={newEmployee.gender}
              onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* DOB + Station ID */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              className="w-full border rounded-md px-3 py-2"
              value={newEmployee.dateOfBirth}
              onChange={(e) => setNewEmployee({ ...newEmployee, dateOfBirth: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Station ID</label>
            <input
              type="text"
              placeholder="Ex: 123"
              className="w-full border rounded-md px-3 py-2"
              value={newEmployee.stationId}
              onChange={(e) => setNewEmployee({ ...newEmployee, stationId: e.target.value })}
            />
          </div>


          <div>
  <label className="block mb-1 text-sm font-medium">Station</label>
  <select
    className="w-full border rounded-md px-3 py-2"
    value={newEmployee.stationId}
    onChange={(e) => setNewEmployee({ ...newEmployee, stationId: e.target.value })}
  >
    <option value="">Select a station</option>
    {
      allStation
      .filter(station => station.ownerId === user.id)
      .map((station) => (
        <option key={station.id} value={station.id}>
          {station.name}
        </option>
      ))
    }
  </select>
</div>

        </div>

        {/* Shift */}
        <div>
          <label className="block mb-1 text-sm font-medium">Shift</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={newEmployee.shift}
            onChange={(e) => setNewEmployee({ ...newEmployee, shift: e.target.value })}
          >
            <option value="">Select Shift</option>
            <option value="Morning (6AM-2PM)">Morning (6AM–2PM)</option>
            <option value="Evening (2PM–10PM)">Evening (2PM–10PM)</option>
            <option value="Full Day (8AM–6PM)">Full Day (8AM–6PM)</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
            onClick={handleAddEmployee}
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
  );
}
