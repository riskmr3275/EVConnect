import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const portsData = [
  { id: 1, status: 'available', power: 22, type: 'AC', rate: 10 },
  { id: 2, status: 'occupied', power: 50, type: 'DC', rate: 15 },
  { id: 3, status: 'maintenance', power: 7, type: 'AC', rate: 8 },
  { id: 4, status: 'available', power: 11, type: 'AC', rate: 12 },
  // Add more as needed
];

const statusColors = {
  available: 'bg-green-500',
  occupied: 'bg-red-500',
  maintenance: 'bg-gray-400',
};

const PortSelector = ({ onSelect }) => {
  const [selectedPort, setSelectedPort] = useState(null);

  const handleSelect = (port) => {
    if (port.status !== 'available') return;
    setSelectedPort(port);
    onSelect(port);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Select a Charging Port</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {portsData.map((port) => (
          <motion.div
            key={port.id}
            className={`p-4 rounded-xl text-white cursor-pointer text-center shadow-md transition-all
              ${statusColors[port.status]}
              ${selectedPort?.id === port.id ? 'ring-4 ring-yellow-300 scale-105' : ''}`}
            onClick={() => handleSelect(port)}
            data-tooltip-id={`port-${port.id}`}
            data-tooltip-content={`⚡ ${port.power}kW | 🔌 ${port.type} | ₹${port.rate}/kWh`}
            data-tooltip-place="top"
          >
            <div className="text-lg font-semibold">Port #{port.id}</div>
            <div className="text-sm capitalize">{port.status}</div>
            <Tooltip id={`port-${port.id}`} />
          </motion.div>
        ))}
      </div>
      {selectedPort && (
        <div className="mt-6 text-center">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            onClick={() => alert(`Proceeding with Port ID: ${selectedPort.id}`)}
          >
            Proceed to Pay
          </button>
        </div>
      )}
    </div>
  );
};

export default PortSelector;
