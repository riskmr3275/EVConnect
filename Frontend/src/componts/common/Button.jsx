import React from 'react';

const Button = ({ children }) => {
  return (
    <button className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 border rounded-md">
      {children}  {/* Correct way to use children */}
    </button>
  );
};

export default Button;
