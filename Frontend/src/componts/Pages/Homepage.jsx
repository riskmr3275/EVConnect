import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  MapPin, 
  Calendar, 
  Car, 
  Package, 
  Clock,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Instagram
} from 'lucide-react';

const Homepage = () => {
  const [activeTab, setActiveTab] = useState('ride');

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 mt-8">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-6">Charge Anywhere, Drive Everywhere</h2>
            
            {/* Ride/Courier Tabs */}
            <div className="flex mb-4">
           
              <button 
                 
                className={"flex items-center p-3 rounded-lg bg-gray-100" }
              >
                <Package className="mr-2" /> All Stations
              </button>
            </div>

            {/* Ride/Courier Input */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="mb-4 flex items-center">
                <MapPin className="mr-2 text-gray-600" />
                <input 
                  type="text" 
                  placeholder="Enter location" 
                  className="w-full bg-transparent focus:outline-none p-3"
                />
              </div>
            
            </div>

            <button className="mt-4 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 cursor-pointer">
              Search Nearby Stations
            </button>
          </div>
          
          {/* Illustrative Image */}
          <div className="hidden md:block">
            <img 
              src="https://cdn.vectorstock.com/i/500p/02/36/electric-car-charging-side-view-vector-55130236.jpg" 
              alt="EVConnect Ride" 
              className="w-full rounded-lg "
            />
          </div>
        </div>

        {/* Service Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-all">
            <h3 className="text-2xl font-bold mb-4">Charge when you want, and what you need</h3>
            <p className="mb-4 text-gray-600">Make money on your schedule with deliveries or rides—or both.</p>
            <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
              Get started
            </button>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-all">
            <h3 className="text-2xl font-bold mb-4">Monetize Your EV Station – Start Earning Now!</h3>
            <p className="mb-4 text-gray-600">Connect with thousands of drivers and earn more per week.</p>
            <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
              Get started
            </button>
          </div>
        </div>


    <div className="flex">
      {/* Left side - Login Section */}
      <div className="w-1/2 p-12 flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-4">Log in to see your recent activity</h1>
        <p className="text-gray-600 mb-8">
          View past details, tailored suggestions, support resources, and more.
        </p>
        
        <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 " >Log in to your account</button>
        
        <p className="text-center text-gray-500">
          Don't have an EVConnect account? <a href="#" className="text-black underline">Sign up</a>
        </p>
      </div>
      
      {/* Right side - Illustration */}
      <div className="w-1/2 bg-blue-50 flex items-center justify-center">
        <div className="relative w-full max-w-[600px] h-[500px]">
           <img src="https://media.istockphoto.com/id/1419348622/vector/electric-car.jpg?s=612x612&w=0&k=20&c=k52UyqYgrkKv4DU7y-L_-Yyako3n-LMFtYi-emNS7sM=" alt="evimage" className="relative w-full max-w-[600px] h-[400px]" />
        </div>
      </div>
    </div>


    <div className="flex ">
         {/* Right side - Illustration */}
      <div className="w-1/2 bg-blue-50 flex items-center justify-center">
        <div className="relative w-full max-w-[600px] h-[500px]">
           <img src="https://images.yourstory.com/cs/2/b3bfb136-ab5e-11e8-8691-f70342131e20/EV-charging-infrastructure-strategy1556549341869.png" />
        </div>
      </div>
      {/* Left side - Login Section */}
      <div className="w-1/2 p-12 flex flex-col justify-center gap-10">
        <h1 className="text-3xl font-bold mb-4">List Your EV Station & Get Paid!</h1>
        
        
        <button className="bg-black text-white px-3 py-3 rounded-md hover:bg-gray-800 " >Get Started</button>
        
        
      </div>
      
     
    </div>






        {/* Suggestions Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Suggestions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all">
              <Package className="h-12 w-12 mb-4 text-blue-600" />
              <h3 className="font-bold text-xl mb-2">Book Now</h3>
              <p className="text-gray-600 mb-4">Drive Worry-Free – Find & Book Your EV Station Now</p>
              <a href="#" className="text-black font-semibold hover:text-blue-600">Details</a>
            </div>
            <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all">
              <Calendar className="h-12 w-12 mb-4 text-green-600" />
              <h3 className="font-bold text-xl mb-2">EV Navigator</h3>
              <p className="text-gray-600 mb-4"> Plan, Drive & Charge with Ease!</p>
              <a href="#" className="text-black font-semibold hover:text-green-600">Details</a>
            </div>
            <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all">
              <Car className="h-12 w-12 mb-4 text-purple-600" />
              <h3 className="font-bold text-xl mb-2">ChargeHub</h3>
              <p className="text-gray-600 mb-4">Join the Network, Power the Future!</p>
              <a href="#" className="text-black font-semibold hover:text-purple-600">Join Now</a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <h2 className="text-2xl font-bold mb-6">EVConnect</h2>
              <div className="flex space-x-4 mb-6">
                <Facebook className="h-6 w-6 hover:text-blue-500" />
                <Twitter className="h-6 w-6 hover:text-blue-400" />
                <Youtube className="h-6 w-6 hover:text-red-500" />
                <Linkedin className="h-6 w-6 hover:text-blue-700" />
                <Instagram className="h-6 w-6 hover:text-pink-500" />
              </div>
              <div className="flex space-x-4">
                <img 
                  src="/api/placeholder/150/50" 
                  alt="Google Play" 
                  className="rounded-lg"
                />
                <img 
                  src="/api/placeholder/150/50" 
                  alt="App Store" 
                  className="rounded-lg"
                />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {['About us', 'Our offerings', 'Newsroom', 'Investors', 'Blog', 'Careers'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-gray-300">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                {['Ride', 'Drive', 'Deliver', 'EVConnect for Business', 'EVConnect Freight', 'Gift cards', 'EVConnect Health'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-gray-300">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Global citizenship</h4>
              <ul className="space-y-2">
                {['Safety', 'Sustainability'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-gray-300">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 flex justify-between items-center">
            <p className="text-sm">© 2025 EVConnect Technologies Inc.</p>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="hover:text-gray-300">Privacy</a>
              <a href="#" className="hover:text-gray-300">Accessibility</a>
              <a href="#" className="hover:text-gray-300">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;