import React, { useState } from 'react';
import Button  from '../common/Button';
import Input  from '../common/Input';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
 import { login } from '../../services/operations/authAPI';
const UberLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const { email, password } = formData
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }
 
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email",email)
    console.log("Password",password)
    console.log('Form submitted:',  email, password );
    dispatch(login(email, password, navigate))
   };

  return (
    <div className="flex min-h-screen">
      {/* Image Side */}
      <div className="w-1/2 bg-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-400 opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 600 600" 
            className="w-full max-w-[500px] transform scale-125"
          >
            {/* Car Body */}
            <path 
              d="M100 400 L500 400 
                 Q530 400, 540 370 
                 L560 320 
                 Q570 300, 550 290 
                 L100 290 Z" 
              fill="#4287f5" 
              className="shadow-lg"
            />
            
            {/* Wheels */}
            <circle cx="180" cy="400" r="40" fill="#333" />
            <circle cx="420" cy="400" r="40" fill="#333" />
            
            {/* Windows */}
            <path 
              d="M200 320 L400 320 
                 Q420 320, 410 300 
                 L380 260 
                 Q370 250, 350 260 
                 L200 320 Z" 
              fill="#e0f2fe" 
            />
            
            {/* Highlights and Details */}
            <path 
              d="M100 370 L500 370" 
              stroke="#ffffff" 
              strokeWidth="4" 
              opacity="0.3"
            />
          </svg>
        </div>
      </div>

      {/* Login/Signup Side */}
      <div className="w-1/2 flex items-center justify-center p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? 'Log in to continue your journey' 
                : 'Sign up to start exploring'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleOnChange}
                placeholder="Enter your email"
                required
                className="w-full"
               
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter your password"
                required
                className="w-full"
              />
              {isLogin && (
                <a 
                  href="#" 
                  className="text-sm text-blue-600 hover:underline block mt-2 text-right"
                >
                  Forgot password?
                </a>
              )}
            </div>

            {!isLogin && (
              <div>
                <label 
                  htmlFor="confirm-password" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <Input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm your password"
                  required
                  className="w-full"
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full mt-4 cursor-pointer"
            >
              {user?.loading ? (
                              <span className="loader cursor-pointer"></span>
                            ) : isLogin ? 'Login In' : 'Sign Up'}
              
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>

          <div className="mt-6 border-t pt-4 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Or continue with
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
              >
                Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
              >
                Apple
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UberLoginPage;