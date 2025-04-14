import React from 'react';

const Input = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  className = "",
  ...rest
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-black bg-white text-gray-900 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...rest}
    />
  );
};

export default Input;
