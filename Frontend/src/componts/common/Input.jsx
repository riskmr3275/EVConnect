import React from 'react';

const Input = ({placeholder}) => {
  console.log("wd",placeholder)
  return (
    
    <div className="mb-6">
      <label htmlFor="default-input" className="block  text-sm font-medium text-gray-900 dark:text-white">
        
      </label>
      <input
        type="text"
        id="default-input"
        placeholder= {placeholder}
        className="w-full px-3 py-2 border border-black bg-white text-gray-900 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default Input;
