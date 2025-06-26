import React from 'react';
import { Zap, CheckCircle, AlertCircle, Settings } from 'lucide-react';

export default function ChargerMonitoring() {
  const chargerData = [
    {
      id: 'CH-001',
      type: 'DC Fast',
      power: '150kW',
      status: 'Available',
      statusIcon: 'check',
      currentSession: '-',
      progress: null,
      progressPercent: '-'
    },
    {
      id: 'CH-002',
      type: 'DC Fast',
      power: '150kW',
      status: 'In Use',
      statusIcon: 'zap',
      currentSession: 'User #1234',
      sessionTime: 'Started: 14:30',
      progress: 75,
      progressPercent: '75%'
    },
    {
      id: 'CH-003',
      type: 'AC Level 2',
      power: '22kW',
      status: 'In Use',
      statusIcon: 'zap',
      currentSession: 'User #5678',
      sessionTime: 'Started: 13:15',
      progress: 45,
      progressPercent: '45%'
    },
    {
      id: 'CH-004',
      type: 'DC Fast',
      power: '150kW',
      status: 'Available',
      statusIcon: 'check',
      currentSession: '-',
      progress: null,
      progressPercent: '-'
    },
    {
      id: 'CH-005',
      type: 'AC Level 2',
      power: '22kW',
      status: 'Maintenance',
      statusIcon: 'alert',
      currentSession: '-',
      progress: null,
      progressPercent: '-'
    }
  ];

  const getStatusBadge = (status, icon) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    
    switch (status) {
      case 'Available':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="h-3 w-3" />
            Available
          </span>
        );
      case 'In Use':
        return (
          <span className={`${baseClasses} bg-gray-800 text-white`}>
            <Zap className="h-3 w-3" />
            In Use
          </span>
        );
      case 'Maintenance':
        return (
          <span className={`${baseClasses} bg-red-500 text-white`}>
            <AlertCircle className="h-3 w-3" />
            Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (icon) => {
    switch (icon) {
      case 'check':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'zap':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Charger Monitoring</h1>
          <p className="text-gray-500">Monitor and control all charging points at your station</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm">Total Chargers</div>
              <Zap className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">5</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm">Available</div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">2</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm">In Use</div>
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">2</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-600 text-sm">Maintenance</div>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">1</div>
          </div>
        </div>

        {/* Live Charger Status Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Live Charger Status</h2>
            <p className="text-gray-500 text-sm">Real-time status and control of all charging points</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Charger ID</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Power</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Current Session</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Progress</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {chargerData.map((charger, index) => (
                  <tr key={charger.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(charger.statusIcon)}
                        <span className="font-medium text-gray-900">{charger.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{charger.type}</td>
                    <td className="py-4 px-6 text-gray-600">{charger.power}</td>
                    <td className="py-4 px-6">
                      {getStatusBadge(charger.status, charger.statusIcon)}
                    </td>
                    <td className="py-4 px-6">
                      {charger.currentSession === '-' ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <div>
                          <div className="text-gray-900 font-medium">{charger.currentSession}</div>
                          <div className="text-gray-500 text-sm">{charger.sessionTime}</div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {charger.progress ? (
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${charger.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 font-medium">
                            {charger.progressPercent}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}