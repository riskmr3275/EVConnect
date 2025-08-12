import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Filter, 
  Download, 
  Search,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  MoreHorizontal
} from 'lucide-react';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('7days');

  // Mock transaction data
  const mockTransactions = [
    {
      id: 'TXN001',
      stationName: 'PowerHub Central Mall',
      customerName: 'Rajesh Kumar',
      amount: 450.00,
      status: 'completed',
      paymentMethod: 'UPI',
      date: '2024-01-15T10:30:00Z',
      duration: '2h 15m',
      energyConsumed: '45.2 kWh',
      portType: 'CCS'
    },
    {
      id: 'TXN002',
      stationName: 'EcoCharge Station',
      customerName: 'Priya Sharma',
      amount: 320.50,
      status: 'completed',
      paymentMethod: 'Credit Card',
      date: '2024-01-15T08:45:00Z',
      duration: '1h 45m',
      energyConsumed: '32.1 kWh',
      portType: 'Type2'
    },
    {
      id: 'TXN003',
      stationName: 'PowerHub Central Mall',
      customerName: 'Arjun Mehta',
      amount: 680.75,
      status: 'pending',
      paymentMethod: 'Wallet',
      date: '2024-01-15T14:20:00Z',
      duration: '3h 10m',
      energyConsumed: '68.5 kWh',
      portType: 'CCS'
    },
    {
      id: 'TXN004',
      stationName: 'GreenPower Station',
      customerName: 'Sneha Patel',
      amount: 275.25,
      status: 'failed',
      paymentMethod: 'UPI',
      date: '2024-01-14T16:15:00Z',
      duration: '1h 30m',
      energyConsumed: '28.3 kWh',
      portType: 'CHAdeMO'
    },
    {
      id: 'TXN005',
      stationName: 'EcoCharge Station',
      customerName: 'Vikram Singh',
      amount: 520.00,
      status: 'completed',
      paymentMethod: 'Credit Card',
      date: '2024-01-14T12:00:00Z',
      duration: '2h 30m',
      energyConsumed: '52.0 kWh',
      portType: 'CCS'
    }
  ];

  // Mock summary data
  const summaryData = {
    totalRevenue: 125750.50,
    todayRevenue: 2248.25,
    totalTransactions: 1247,
    successRate: 94.2,
    avgTransactionValue: 425.75,
    monthlyGrowth: 12.5
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-600">Monitor and manage all your charging station transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(summaryData.totalRevenue)}
          </div>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(summaryData.todayRevenue)}
          </div>
          <p className="text-sm text-gray-600">Today's Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {summaryData.totalTransactions.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">Total Transactions</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {summaryData.successRate}%
          </div>
          <p className="text-sm text-gray-600">Success Rate</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(summaryData.avgTransactionValue)}
          </div>
          <p className="text-sm text-gray-600">Avg Transaction</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            +{summaryData.monthlyGrowth}%
          </div>
          <p className="text-sm text-gray-600">Monthly Growth</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {/* Date Range */}
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
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Transaction</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Station</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{transaction.id}</div>
                      <div className="text-sm text-gray-500">
                        {transaction.energyConsumed} • {transaction.duration}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{transaction.customerName}</div>
                      <div className="text-sm text-gray-500">{transaction.portType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{transaction.stationName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold text-gray-900">{formatCurrency(transaction.amount)}</div>
                      <div className="text-sm text-gray-500">{transaction.paymentMethod}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{formatDate(transaction.date)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;