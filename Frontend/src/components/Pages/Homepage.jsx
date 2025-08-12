import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Instagram,
  Zap,
  Battery,
  Shield,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Globe,
  Smartphone,
  Search,
  Navigation,
  Award,
  BarChart3,
  Leaf
} from 'lucide-react';
import PublicStationFinder from '../common/PublicStationFinder';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">EVConnect</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium">About</a>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  India's Leading EV Charging Network
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Charge Anywhere,
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Drive Everywhere</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Find, book, and pay for EV charging stations across India. Join thousands of drivers making the switch to sustainable transportation.
                </p>
              </div>

              {/* Public Station Finder */}
              <PublicStationFinder />

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-gray-600">Charging Stations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-gray-600">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">25+</div>
                  <div className="text-gray-600">Cities Covered</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=600&h=400&fit=crop&crop=center" 
                  alt="Electric Vehicle Charging" 
                  className="w-full rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Available Now</div>
                    <div className="text-sm text-gray-600">5 stations nearby</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Fast Charging</div>
                    <div className="text-sm text-gray-600">Up to 150kW</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose EVConnect?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of electric vehicle charging with our comprehensive platform designed for modern EV drivers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Stations Instantly</h3>
              <p className="text-gray-600 mb-6">
                Locate the nearest charging stations with real-time availability, pricing, and connector types.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Real-time availability
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Multiple connector types
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Transparent pricing
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Book & Reserve</h3>
              <p className="text-gray-600 mb-6">
                Reserve your charging slot in advance and never worry about waiting in queues again.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Advance booking
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Guaranteed slots
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Flexible cancellation
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Seamless Payments</h3>
              <p className="text-gray-600 mb-6">
                Pay securely through the app with multiple payment options and get instant receipts.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Multiple payment methods
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Secure transactions
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Instant receipts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Sections */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Users className="w-4 h-4" />
                For EV Drivers
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Charge When You Want, What You Need
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of EV drivers who trust EVConnect for their daily charging needs. 
                Find stations, book slots, and charge with confidence.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">24/7 Availability</h4>
                    <p className="text-gray-600">Access charging stations anytime, anywhere</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Safe & Secure</h4>
                    <p className="text-gray-600">All stations are verified and monitored</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Growing Network</h4>
                    <p className="text-gray-600">New stations added every week</p>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop" 
                alt="EV Charging Experience" 
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Station Owner Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop" 
                alt="EV Station Business" 
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              
              {/* Floating Earnings Card */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹25,000+</div>
                  <div className="text-sm text-gray-600">Monthly Earnings</div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4" />
                For Station Owners
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Monetize Your EV Station – Start Earning Now!
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Connect with thousands of EV drivers and turn your charging station into a profitable business. 
                Join our network and start earning today.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Maximize Revenue</h4>
                    <p className="text-gray-600">Optimize pricing and increase utilization</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Access to Customers</h4>
                    <p className="text-gray-600">Connect with 50,000+ active EV drivers</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Easy Management</h4>
                    <p className="text-gray-600">Comprehensive dashboard and analytics</p>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/owner-signup" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all font-semibold text-lg"
              >
                List Your Station
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How EVConnect Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with EVConnect in just a few simple steps and experience hassle-free EV charging.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Find & Book</h3>
              <p className="text-gray-600 mb-6">
                Search for nearby charging stations, check availability, and book your preferred time slot.
              </p>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop" 
                  alt="Find stations" 
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Navigate & Charge</h3>
              <p className="text-gray-600 mb-6">
                Get turn-by-turn directions to your chosen station and start charging with a simple QR scan.
              </p>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=300&h=200&fit=crop" 
                  alt="Navigate and charge" 
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pay & Go</h3>
              <p className="text-gray-600 mb-6">
                Pay securely through the app and get instant receipts. Track your charging history and savings.
              </p>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop" 
                  alt="Pay and go" 
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Join the Electric Revolution?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of EV drivers who have already made the switch to sustainable transportation with EVConnect.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/signup" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg flex items-center gap-2"
              >
                Start Charging Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <button className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors font-medium">
                <Play className="w-5 h-5" />
                Watch Demo Video
              </button>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-blue-100">Charging Stations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-blue-100">Happy Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">1M+</div>
                <div className="text-blue-100">Charging Sessions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">25+</div>
                <div className="text-blue-100">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>






      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what thousands of EV drivers are saying about EVConnect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "EVConnect has completely transformed my daily commute. Finding and booking charging stations is now effortless!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">RK</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Rajesh Kumar</div>
                  <div className="text-gray-600 text-sm">Tesla Model 3 Owner</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "As a station owner, EVConnect has helped me increase my revenue by 300%. The platform is incredibly user-friendly."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">PS</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Priya Sharma</div>
                  <div className="text-gray-600 text-sm">Station Owner, Mumbai</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The app is intuitive and the payment process is seamless. I can't imagine using any other charging network now."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">AM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Arjun Mehta</div>
                  <div className="text-gray-600 text-sm">Hyundai Kona Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" />
                Environmental Impact
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Driving Towards a Greener Future
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Every charge through EVConnect contributes to a cleaner environment. 
                Join us in reducing carbon emissions and building a sustainable future.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">2.5M kg</div>
                  <div className="text-gray-600">CO₂ Saved</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">1M+</div>
                  <div className="text-gray-600">Clean Miles</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop" 
                alt="Green Environment" 
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold">EVConnect</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                India's leading EV charging network, connecting drivers with reliable, 
                fast, and affordable charging solutions across the country.
              </p>
              
              <div className="flex space-x-4 mb-8">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">Download our app</p>
                <div className="flex space-x-4">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                    alt="Google Play" 
                    className="h-12 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                  />
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                    alt="App Store" 
                    className="h-12 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-3">
                {[
                  'About Us',
                  'Our Mission',
                  'Careers',
                  'Press & Media',
                  'Blog',
                  'Investors'
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Services</h4>
              <ul className="space-y-3">
                {[
                  'Find Stations',
                  'Book Charging',
                  'Station Owners',
                  'Business Solutions',
                  'API Integration',
                  'Support'
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 EVConnect Technologies Inc. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;