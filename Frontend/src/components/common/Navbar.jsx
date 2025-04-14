import React from 'react'
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="border-b-[1px] border-b-white">
      <nav className="sticky top-0 z-50 bg-black shadow-sm border-b-white">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-6">
            <a href="/">
              <img src="/src/assets/logo.png" alt="EVConnect Logo" className="h-13 w-auto object-contain" />
            </a>
            <div className="hidden md:flex space-x-4">
              <a href="/" className="text-white font-bold hover:text-gray-600">Home</a>
              <a href="#" className="text-white font-bold hover:text-gray-600">Find Stations</a>
              <a href="#" className="text-white font-bold hover:text-gray-600">Business</a>
              <a href="#" className="flex items-center text-white font-bold hover:text-gray-600">
                About Us<ChevronDown className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hidden md:block text-white font-bold hover:text-gray-600">EN</a>

            {!user?.token && (
              <>
                <Link to={"/login"}>
                  <button className="text-white font-bold hover:text-gray-400 px-3 py-2 rounded-md cursor-pointer">
                    Log in
                  </button>
                </Link>
                <Link to={"/signup"}>
                  <button className="text-black font-bold bg-white px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
