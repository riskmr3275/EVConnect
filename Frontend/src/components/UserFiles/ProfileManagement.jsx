import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Car, Edit3, Save, X, Camera, Shield, Key, Upload, Trash2, Star, Award, Activity, TrendingUp, Zap, Battery, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../services/apiconnector';
import { authEndpoints, evEndpoints } from '../../services/api';
import { toast } from 'react-toastify';

const ProfileManagement = () => {
    const { user } = useSelector((state) => state.profile);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [userEVs, setUserEVs] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Mock user stats for enhanced UI
    const userStats = {
        totalBookings: 24,
        completedSessions: 18,
        totalEnergyCharged: 1250, // kWh
        carbonSaved: 425, // kg CO2
        favoriteStations: 5,
        memberSince: '2023',
        currentStreak: 7, // days
        achievements: [
            { id: 1, name: 'Early Adopter', icon: '🚀', description: 'One of the first 1000 users' },
            { id: 2, name: 'Eco Warrior', icon: '🌱', description: 'Saved 500kg+ CO2' },
            { id: 3, name: 'Frequent Charger', icon: '⚡', description: '20+ charging sessions' },
        ]
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        dateOfBirth: '',
        gender: '',
        about: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [newEV, setNewEV] = useState({
        brand: '',
        model: '',
        licensePlate: '',
        batteryCapacity: '',
        preferredAcPort: '',
        preferredDcPort: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                contactNumber: user.contactNumber || '',
                dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
                gender: user.gender || '',
                about: user.about || '',
                address: user.userDetails?.address || '',
                city: user.userDetails?.city || '',
                state: user.userDetails?.state || '',
                zipCode: user.userDetails?.zipCode || '',
            });
        }
        loadUserEVs();
    }, [user]);

    const loadUserEVs = async () => {
        try {
            const response = await apiConnector('GET', evEndpoints.GET_USER_EVS_API);
            if (response.data.success) {
                setUserEVs(response.data.data || []);
            }
        } catch (error) {
            console.error('Error loading EVs:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEVChange = (e) => {
        const { name, value } = e.target;
        setNewEV(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);

            // Update user profile
            const response = await apiConnector('PUT', `${authEndpoints.UPDATE_PROFILE_API}`, formData);

            if (response.data.success) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
                // Update Redux store if needed
                // dispatch(updateProfile(response.data.user));
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        try {
            setLoading(true);

            const response = await apiConnector('PUT', `${authEndpoints.CHANGE_PASSWORD_API}`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (response.data.success) {
                toast.success('Password changed successfully');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleAddEV = async () => {
        if (!newEV.brand || !newEV.model || !newEV.licensePlate || !newEV.batteryCapacity) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            const response = await apiConnector('POST', evEndpoints.CREATE_EV_API, {
                ...newEV,
                batteryCapacity: parseFloat(newEV.batteryCapacity),
            });

            if (response.data.success) {
                toast.success('EV added successfully');
                setNewEV({
                    brand: '',
                    model: '',
                    licensePlate: '',
                    batteryCapacity: '',
                    preferredAcPort: '',
                    preferredDcPort: '',
                });
                loadUserEVs();
            }
        } catch (error) {
            console.error('Error adding EV:', error);
            toast.error('Failed to add EV');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEV = async (evId) => {
        if (!window.confirm('Are you sure you want to delete this EV?')) {
            return;
        }

        try {
            const response = await apiConnector('DELETE', `${evEndpoints.DELETE_EV_API}/${evId}`);

            if (response.data.success) {
                toast.success('EV deleted successfully');
                loadUserEVs();
            }
        } catch (error) {
            console.error('Error deleting EV:', error);
            toast.error('Failed to delete EV');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Image size should be less than 5MB');
                return;
            }

            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadProfileImage = async () => {
        if (!profileImage) return;

        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append('image', profileImage);

            // Replace with your actual upload endpoint
            const response = await apiConnector('POST', `${authEndpoints.UPLOAD_PROFILE_IMAGE_API}`, formData, {
                'Content-Type': 'multipart/form-data'
            });

            if (response.data.success) {
                toast.success('Profile image updated successfully');
                setImagePreview(null);
                setProfileImage(null);
                // Update user profile in Redux if needed
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const renderOverview = () => (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                            {imagePreview || user?.image ? (
                                <img
                                    src={imagePreview || user.image}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-4xl font-bold">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            )}
                        </div>
                        <label className="absolute bottom-2 right-2 bg-white text-blue-600 p-3 rounded-full hover:bg-gray-100 transition-colors cursor-pointer shadow-lg">
                            <Camera className="w-5 h-5" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                        {imagePreview && (
                            <button
                                onClick={uploadProfileImage}
                                disabled={uploadingImage}
                                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {uploadingImage ? 'Uploading...' : 'Save'}
                            </button>
                        )}
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-3xl font-bold mb-2">{user?.name || 'User'}</h2>
                        <p className="text-blue-100 text-lg mb-2">{user?.email}</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                {user?.accountType?.toLowerCase()} Account
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                Member since {userStats.memberSince}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{userStats.totalBookings}</p>
                            <p className="text-sm text-gray-600">Total Bookings</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Zap className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{userStats.totalEnergyCharged}</p>
                            <p className="text-sm text-gray-600">kWh Charged</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <Activity className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{userStats.carbonSaved}</p>
                            <p className="text-sm text-gray-600">kg CO₂ Saved</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{userStats.currentStreak}</p>
                            <p className="text-sm text-gray-600">Day Streak</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-500" />
                    Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {userStats.achievements.map((achievement) => (
                        <div key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                            <div className="text-center">
                                <div className="text-3xl mb-2">{achievement.icon}</div>
                                <h4 className="font-semibold text-gray-900 mb-1">{achievement.name}</h4>
                                <p className="text-sm text-gray-600">{achievement.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-blue-500" />
                    Recent Activity
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="p-2 bg-green-100 rounded-full">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Charging session completed</p>
                            <p className="text-sm text-gray-600">EcoCharge Central • 45.2 kWh • 2 hours ago</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">New booking confirmed</p>
                            <p className="text-sm text-gray-600">PowerHub Station • Tomorrow 2:00 PM</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="p-2 bg-purple-100 rounded-full">
                            <Award className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Achievement unlocked</p>
                            <p className="text-sm text-gray-600">Eco Warrior badge earned • 3 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPersonalInfo = () => (
        <div className="space-y-8">
            {/* Enhanced Profile Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                            {imagePreview || user?.image ? (
                                <img
                                    src={imagePreview || user.image}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-3xl font-bold">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer shadow-lg">
                            <Camera className="w-4 h-4" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || 'User'}</h3>
                        <p className="text-gray-600 mb-2">{user?.email}</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {user?.accountType?.toLowerCase()} Account
                            </span>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                Verified
                            </span>
                        </div>
                    </div>
                </div>
                {imagePreview && (
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={uploadProfileImage}
                            disabled={uploadingImage}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            {uploadingImage ? 'Uploading...' : 'Save Profile Picture'}
                        </button>
                    </div>
                )}
            </div>

            {/* Enhanced Personal Information Form */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isEditing
                                    ? 'border-gray-300 bg-white hover:border-gray-400'
                                    : 'border-gray-200 bg-gray-50'
                                    }`}
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isEditing
                                    ? 'border-gray-300 bg-white hover:border-gray-400'
                                    : 'border-gray-200 bg-gray-50'
                                    }`}
                                placeholder="Enter your email address"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isEditing
                                    ? 'border-gray-300 bg-white hover:border-gray-400'
                                    : 'border-gray-200 bg-gray-50'
                                    }`}
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isEditing
                                    ? 'border-gray-300 bg-white hover:border-gray-400'
                                    : 'border-gray-200 bg-gray-50'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isEditing
                                ? 'border-gray-300 bg-white hover:border-gray-400'
                                : 'border-gray-200 bg-gray-50'
                                }`}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">City</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isEditing
                                    ? 'border-gray-300 bg-white hover:border-gray-400'
                                    : 'border-gray-200 bg-gray-50'
                                    }`}
                                placeholder="Enter your city"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    About Me
                </h4>
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Bio</label>
                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${isEditing
                            ? 'border-gray-300 bg-white hover:border-gray-400'
                            : 'border-gray-200 bg-gray-50'
                            }`}
                        placeholder="Tell us about yourself, your interests in electric vehicles, and your charging preferences..."
                    />
                    <p className="text-xs text-gray-500">
                        {formData.about?.length || 0}/500 characters
                    </p>
                </div>
            </div>

            {/* Address Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Address Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Full Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            rows={3}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${isEditing
                                ? 'border-gray-300 bg-white hover:border-gray-400'
                                : 'border-gray-200 bg-gray-50'
                                }`}
                            placeholder="Enter your complete address including street, area, and landmarks..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isEditing
                                ? 'border-gray-300 bg-white hover:border-gray-400'
                                : 'border-gray-200 bg-gray-50'
                                }`}
                            placeholder="Enter your state"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">ZIP Code</label>
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isEditing
                                ? 'border-gray-300 bg-white hover:border-gray-400'
                                : 'border-gray-200 bg-gray-50'
                                }`}
                            placeholder="Enter ZIP code"
                        />
                    </div>
                </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
                {isEditing ? (
                    <>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2 font-medium"
                        >
                            <X className="w-5 h-5" />
                            Cancel Changes
                        </button>
                        <button
                            onClick={handleSaveProfile}
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
                    >
                        <Edit3 className="w-5 h-5" />
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );

    const renderSecurity = () => (
        <div className="space-y-8">
            {/* Security Overview */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                        <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-green-800">Account Security</h4>
                        <p className="text-green-700">Your account security status</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-900">Email Verified</span>
                        </div>
                        <p className="text-sm text-gray-600">Your email is verified and secure</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-900">Strong Password</span>
                        </div>
                        <p className="text-sm text-gray-600">Password meets security requirements</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            <span className="font-medium text-gray-900">2FA Disabled</span>
                        </div>
                        <p className="text-sm text-gray-600">Enable for extra security</p>
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Key className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-gray-900">Change Password</h4>
                        <p className="text-gray-600">Update your password to keep your account secure</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Current Password *</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-all"
                                placeholder="Enter your current password"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">New Password *</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-all"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Confirm New Password *</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-all"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <h5 className="font-medium text-blue-900 mb-2">Password Requirements:</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                At least 8 characters long
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                Contains uppercase and lowercase letters
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                Contains at least one number
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                Contains at least one special character
                            </li>
                        </ul>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleChangePassword}
                            disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            <Key className="w-5 h-5" />
                            {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-100 rounded-full">
                        <Shield className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <span className="font-medium text-orange-800">2FA is currently disabled</span>
                    </div>
                    <p className="text-sm text-orange-700">
                        Enable two-factor authentication to significantly improve your account security.
                    </p>
                </div>

                <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Enable Two-Factor Authentication
                </button>
            </div>
        </div>
    );

    const renderEVManagement = () => (
        <div className="space-y-8">
            {/* EV Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-600 rounded-full">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-900">{userEVs.length}</p>
                            <p className="text-blue-700 font-medium">Registered EVs</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-600 rounded-full">
                            <Battery className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-900">
                                {userEVs.reduce((total, ev) => total + (ev.batteryCapacity || 0), 0)}
                            </p>
                            <p className="text-green-700 font-medium">Total kWh Capacity</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-600 rounded-full">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-900">24</p>
                            <p className="text-purple-700 font-medium">Charging Sessions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add New EV */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 rounded-full">
                        <Car className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-gray-900">Add New Electric Vehicle</h4>
                        <p className="text-gray-600">Register your EV to track charging history and preferences</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Brand *</label>
                        <input
                            type="text"
                            name="brand"
                            value={newEV.brand}
                            onChange={handleEVChange}
                            placeholder="e.g., Tesla, BMW, Nissan"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-gray-400 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Model *</label>
                        <input
                            type="text"
                            name="model"
                            value={newEV.model}
                            onChange={handleEVChange}
                            placeholder="e.g., Model 3, i3, Leaf"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-gray-400 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">License Plate *</label>
                        <input
                            type="text"
                            name="licensePlate"
                            value={newEV.licensePlate}
                            onChange={handleEVChange}
                            placeholder="e.g., ABC-1234"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-gray-400 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Battery Capacity (kWh) *</label>
                        <input
                            type="number"
                            name="batteryCapacity"
                            value={newEV.batteryCapacity}
                            onChange={handleEVChange}
                            placeholder="e.g., 75"
                            min="1"
                            max="200"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-gray-400 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Preferred AC Port</label>
                        <select
                            name="preferredAcPort"
                            value={newEV.preferredAcPort}
                            onChange={handleEVChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-gray-400 transition-all"
                        >
                            <option value="">Select AC Port Type</option>
                            <option value="Type1">Type 1 (J1772)</option>
                            <option value="Type2">Type 2 (Mennekes)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Preferred DC Port</label>
                        <select
                            name="preferredDcPort"
                            value={newEV.preferredDcPort}
                            onChange={handleEVChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-gray-400 transition-all"
                        >
                            <option value="">Select DC Port Type</option>
                            <option value="CCS">CCS (Combined Charging System)</option>
                            <option value="CHAdeMO">CHAdeMO</option>
                            <option value="Tesla">Tesla Supercharger</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleAddEV}
                        disabled={loading || !newEV.brand || !newEV.model || !newEV.licensePlate || !newEV.batteryCapacity}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <Car className="w-5 h-5" />
                        {loading ? 'Adding Vehicle...' : 'Add Electric Vehicle'}
                    </button>
                </div>
            </div>

            {/* EV List */}
            <div className="space-y-6">
                <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Car className="w-6 h-6 text-blue-600" />
                    Your Electric Vehicles
                </h4>

                {userEVs.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Car className="w-10 h-10 text-gray-400" />
                        </div>
                        <h5 className="text-xl font-semibold text-gray-900 mb-2">No Electric Vehicles Yet</h5>
                        <p className="text-gray-600 mb-6">Add your first EV to start tracking your charging history and preferences.</p>
                        <button
                            onClick={() => document.querySelector('input[name="brand"]').focus()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                        >
                            Add Your First EV
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userEVs.map((ev) => (
                            <div key={ev.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-100 rounded-full">
                                            <Car className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h5 className="text-lg font-bold text-gray-900">{ev.brand} {ev.model}</h5>
                                            <p className="text-gray-600 font-medium">{ev.licensePlate}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEV(ev.id)}
                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete EV"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Battery className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-gray-600">Battery: {ev.batteryCapacity} kWh</span>
                                    </div>

                                    {ev.preferredAcPort && (
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm text-gray-600">AC Port: {ev.preferredAcPort}</span>
                                        </div>
                                    )}

                                    {ev.preferredDcPort && (
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm text-gray-600">DC Port: {ev.preferredDcPort}</span>
                                        </div>
                                    )}

                                    {ev.isDefault && (
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            <span className="text-sm font-medium text-yellow-700">Default Vehicle</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Added on {new Date().toLocaleDateString()}</span>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            Edit Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-4 md:p-6 w-full">
               

                {/* Enhanced Tabs */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
                    <div className="flex flex-wrap border-b border-gray-200 bg-gray-50">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 min-w-0 px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'overview'
                                ? 'text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">Overview</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`flex-1 min-w-0 px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'personal'
                                ? 'text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <Edit3 className="w-4 h-4" />
                            <span className="hidden sm:inline">Personal Info</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`flex-1 min-w-0 px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'security'
                                ? 'text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <Shield className="w-4 h-4" />
                            <span className="hidden sm:inline">Security</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('evs')}
                            className={`flex-1 min-w-0 px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'evs'
                                ? 'text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <Car className="w-4 h-4" />
                            <span className="hidden sm:inline">My EVs</span>
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'personal' && renderPersonalInfo()}
                        {activeTab === 'security' && renderSecurity()}
                        {activeTab === 'evs' && renderEVManagement()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileManagement;