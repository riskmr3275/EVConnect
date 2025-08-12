import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Filter, 
  Download, 
  Users,
  Zap,
  DollarSign,
  Clock,
  Battery,
  MapPin,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 125750.50,
      totalSessions: 1247,
      totalEnergyDelivered: 15680.5, // kWh
      averageSessionDuration: 2.3, // hours
      customerSatisfaction: 4.6,
      stationUtilization: 78.5 // percentage
    },
    trends: {
      revenueGrowth: 12.5,
      sessionGrowth: 8.3,
      energyGrowth: 15.2,
      utilizationGrowth: -2.1
    },
    topStations: [
      { name: 'PowerHub Central Mall', revenue: 45250, sessions: 342, utilization: 85.2 },
      { name: 'EcoCharge Station', revenue: 38750, sessions: 298, utilization: 82.1 },
      { name: 'GreenPower Station', revenue: 32100, sessions: 245, utilization: 76.8 },
      { name: 'FastCharge Hub', revenue: 28650, sessions: 201, utilization: 71.3 }
    ],
    hourlyUsage: [
      { hour: '00:00', sessions: 12, revenue: 850 },
      { hour: '01:00', sessions: 8, revenue: 560 },
      { hour: '02:00', sessions: 5, revenue: 350 },
      { hour: '03:00', sessions: 3, revenue: 210 },
      { hour: '04:00', sessions: 4, revenue: 280 },
      { hour: '05:00', sessions: 15, revenue: 1050 },
      { hour: '06:00', sessions: 28, revenue: 1960 },
      { hour: '07:00', sessions: 45, revenue: 3150 },
      { hour: '08:00', sessions: 52, revenue: 3640 },
      { hour: '09:00', sessions: 48, revenue: 3360 },
      { hour: '10:00', sessions: 42, revenue: 2940 },
      { hour: '11:00', sessions: 38, revenue: 2660 },
      { hour: '12:00', sessions: 55, revenue: 3850 },
      { hour: '13:00', sessions: 58, revenue: 4060 },
      { hour: '14:00', sessions: 62, revenue: 4340 },
      { hour: '15:00', sessions: 59, revenue: 4130 },
      { hour: '16:00', sessions: 65, revenue: 4550 },
      { hour: '17:00', sessions: 72, revenue: 5040 },
      { hour: '18:00', sessions: 78, revenue: 5460 },
      { hour: '19:00', sessions: 68, revenue: 4760 },
      { hour: '20:00', sessions: 52, revenue: 3640 },
      { hour: '21:00', sessions: 38, revenue: 2660 },
      { hour: '22:00', sessions: 25, revenue: 1750 },
      { hour: '23:00', sessions: 18, revenue: 1260 }
    ],
    customerSegments: [
      { segment: 'Regular Users', count: 456, percentage: 36.5, avgSpend: 425 },
      { segment: 'Occasional Users', count: 623, percentage: 49.9, avgSpend: 285 },
      { segment: 'New Users', count: 168, percentage: 13.6, avgSpend: 195 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getMaxHourlyValue = () => {
    return Math.max(...analyticsData.hourlyUsage.map(item => 
      selectedMetric === 'revenue' ? item.revenue : item.sessions
    ));
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights into your charging station performance</p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              analyticsData.trends.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analyticsData.trends.revenueGrowth > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(analyticsData.trends.revenueGrowth)}%
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(analyticsData.overview.totalRevenue)}
          </div>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              analyticsData.trends.sessionGrowth > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analyticsData.trends.sessionGrowth > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(analyticsData.trends.sessionGrowth)}%
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatNumber(analyticsData.overview.totalSessions)}
          </div>
          <p className="text-sm text-gray-600">Charging Sessions</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Battery className="w-6 h-6 text-purple-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              analyticsData.trends.energyGrowth > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analyticsData.trends.energyGrowth > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(analyticsData.trends.energyGrowth)}%
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatNumber(analyticsData.overview.totalEnergyDelivered)} kWh
          </div>
          <p className="text-sm text-gray-600">Energy Delivered</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.overview.averageSessionDuration}h
          </div>
          <p className="text-sm text-gray-600">Avg Session Time</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.overview.customerSatisfaction}/5
          </div>
          <p className="text-sm text-gray-600">Customer Rating</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              analyticsData.trends.utilizationGrowth > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analyticsData.trends.utilizationGrowth > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(analyticsData.trends.utilizationGrowth)}%
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.overview.stationUtilization}%
          </div>
          <p className="text-sm text-gray-600">Utilization Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Hourly Usage Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Hourly Usage Pattern</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sessions">Sessions</option>
              <option value="revenue">Revenue</option>
            </select>
          </div>
          
          <div className="space-y-2">
            {analyticsData.hourlyUsage.map((item, index) => {
              const maxValue = getMaxHourlyValue();
              const value = selectedMetric === 'revenue' ? item.revenue : item.sessions;
              const percentage = (value / maxValue) * 100;
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 text-xs text-gray-600 font-medium">{item.hour}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {selectedMetric === 'revenue' ? formatCurrency(value) : value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performing Stations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Stations</h3>
          
          <div className="space-y-4">
            {analyticsData.topStations.map((station, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{station.name}</div>
                    <div className="text-sm text-gray-600">{station.sessions} sessions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{formatCurrency(station.revenue)}</div>
                  <div className="text-sm text-gray-600">{station.utilization}% utilization</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Segments</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyticsData.customerSegments.map((segment, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-2">{segment.count}</div>
              <div className="text-lg font-medium text-gray-700 mb-1">{segment.segment}</div>
              <div className="text-sm text-gray-600 mb-3">{segment.percentage}% of total users</div>
              <div className="text-sm font-medium text-green-600">
                Avg spend: {formatCurrency(segment.avgSpend)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;