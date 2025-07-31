"use client";
import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Building2, 
  MapPin, 
  Edit3, 
  Eye, 
  EyeOff,
  Bell,
  Camera,
  Instagram,
  Calendar,
  Users,
  X,
  Check,
  AlertCircle,
  Shield,
  FileText,
  Settings,
  Phone,
  Mail,
  Globe,
  Trash2,
  Save,
  ChevronRight,
  Star,
  Award,
  Briefcase
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    fullName: "Studio Visuals",
    email: "contact@studiovisuals.com",
    phone: "+91 98765 43210",
    website: "https://studiovisuals.com",
    bio: "Professional photography studio specializing in weddings, events, and corporate photography with over 8 years of experience.",
    avatar: "/api/placeholder/120/120"
  });

  // Business data state
  const [businessData, setBusinessData] = useState({
    vendorName: "Studio Visuals",
    vendorType: "studio",
    teamSize: 8,
    country: "India",
    state: "Gujarat",
    city: "Ahmedabad",
    instagramHandle: "@studiovisuals",
    avgBookingDays: 12,
    inHouseDesigner: "Yes",
    traveledOutsideCountry: true,
    countriesTraveled: ["UAE", "Singapore", "Thailand"],
    traveledOutsideCity: true,
    citiesTraveled: ["Mumbai", "Delhi", "Bangalore", "Chennai"],
    openToTravel: true,
    establishedYear: "2016",
    specialization: ["Wedding Photography", "Corporate Events", "Product Photography"]
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingUpdates: true,
    paymentAlerts: true,
    marketingEmails: false
  });

  // Admin notifications
  const [adminNotifications] = useState([
    {
      id: 1,
      title: "Platform Update",
      message: "New features have been added to your dashboard. Check out the updated portfolio management system.",
      date: "2025-05-20",
      read: false,
      type: "update"
    },
    {
      id: 2,
      title: "Payment Processing Changes", 
      message: "Important changes to payment processing. Please review the new terms and conditions.",
      date: "2025-05-18",
      read: true,
      type: "important"
    },
    {
      id: 3,
      title: "New Partnership Opportunities",
      message: "We've partnered with leading event planners in your area. New booking opportunities available.",
      date: "2025-05-12",
      read: false,
      type: "opportunity"
    }
  ]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handlePasswordUpdate = () => {
    const errors = validatePasswordForm();
    setPasswordErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setPasswordUpdateSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        setPasswordUpdateSuccess(false);
      }, 3000);
    }
  };

  const handleProfileSave = () => {
    setEditingProfile(false);
    // Here you would save to API
    console.log('Profile saved:', profileData);
  };

  const handleBusinessSave = () => {
    setEditingBusiness(false);
    // Here you would save to API
    console.log('Business saved:', businessData);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'update': 
        return { icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'important': 
        return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      case 'opportunity': 
        return { icon: Star, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      default: 
        return { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Personal information and bio' },
    { id: 'business', label: 'Business', icon: Building2, description: 'Studio details and services' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Communication preferences' },
    { id: 'security', label: 'Security', icon: Lock, description: 'Password and account security' }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className=" bg-[#892580] to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img 
              src={profileData.avatar} 
              alt="Profile" 
              className="w-24 h-24 rounded-2xl border-4 border-white/20 object-cover"
            />
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-[#892580] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <Camera size={16} />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
            <p className="text-white/80 mb-2">Professional Studio</p>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <div className="flex items-center gap-1">
                <Award size={14} />
                <span>8+ Years Experience</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} />
                <span>4.9 Rating</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditingProfile(!editingProfile)}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <Edit3 size={16} />
            {editingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <p className="text-sm text-gray-600 mt-1">Update your personal details and contact information</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                  disabled={!editingProfile}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!editingProfile}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!editingProfile}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                  disabled={!editingProfile}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              rows={4}
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              disabled={!editingProfile}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
              placeholder="Tell us about your studio and experience..."
            />
          </div>
          
          {editingProfile && (
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setEditingProfile(false)}
                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileSave}
                className="px-6 py-2 bg-gradient-to-r from-[#892580] to-purple-600 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-2"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      {/* Business Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Building2 className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Business Type</p>
              <p className="text-lg font-bold text-blue-900 capitalize">{businessData.vendorType}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Team Size</p>
              <p className="text-lg font-bold text-green-900">{businessData.teamSize} Members</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Award className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Since</p>
              <p className="text-lg font-bold text-purple-900">{businessData.establishedYear}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Details */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
              <p className="text-sm text-gray-600 mt-1">Manage your business details and specializations</p>
            </div>
            <button
              onClick={() => setEditingBusiness(!editingBusiness)}
              className="px-4 py-2 bg-[#892580] text-white rounded-xl hover:bg-[#892580] transition-colors flex items-center gap-2"
            >
              <Edit3 size={16} />
              {editingBusiness ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                value={businessData.vendorName}
                onChange={(e) => setBusinessData(prev => ({ ...prev, vendorName: e.target.value }))}
                disabled={!editingBusiness}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Handle</label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={businessData.instagramHandle}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, instagramHandle: e.target.value }))}
                  disabled={!editingBusiness}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={`${businessData.city}, ${businessData.state}`}
                  disabled
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avg Bookings/Month</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  value={businessData.avgBookingDays}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, avgBookingDays: parseInt(e.target.value) }))}
                  disabled={!editingBusiness}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
          
          {/* Specializations */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Specializations</label>
            <div className="flex flex-wrap gap-2">
              {businessData.specialization.map((spec, index) => (
                <span key={index} className="px-4 py-2 bg-[#892580] text-white rounded-full text-sm font-medium">
                  {spec}
                </span>
              ))}
            </div>
          </div>
          
          {/* Travel Experience */}
          {businessData.traveledOutsideCountry && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Globe size={16} />
                International Experience
              </h4>
              <div className="flex flex-wrap gap-2">
                {businessData.countriesTraveled.map((country, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                    {country}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {editingBusiness && (
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setEditingBusiness(false)}
                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBusinessSave}
                className="px-6 py-2 bg-gradient-to-r from-[#892580] to-purple-600 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-2"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
=

      {/* Recent Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
          <p className="text-sm text-gray-600 mt-1">Latest updates from the platform</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {adminNotifications.map((notification) => {
            const notificationStyle = getNotificationIcon(notification.type);
            const IconComponent = notificationStyle.icon;
            
            return (
              <div key={notification.id} className={`p-6 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-purple-50' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${notificationStyle.bg} ${notificationStyle.border} border rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`${notificationStyle.color}`} size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        {notification.title}
                        {!notification.read && (
                          <span className="w-2 h-2 bg-[#892580] rounded-full"></span>
                        )}
                      </h4>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(notification.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        notification.type === 'important' ? 'bg-red-100 text-red-800' :
                        notification.type === 'update' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {notification.type}
                      </span>
                      
                      {!notification.read && (
                        <button className="text-[#892580] hover:text-purple-700 text-xs font-medium flex items-center gap-1">
                          <Check size={12} />
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

 const renderSecurityTab = () => {
  return (
    <div className="space-y-6">
      {/* Success Message */}
      {passwordUpdateSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="text-green-600" size={16} />
          </div>
          <span className="text-sm font-medium text-green-800">Password updated successfully!</span>
        </div>
      )}

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
          <p className="text-sm text-gray-600 mt-1">Update your password to keep your account secure</p>
        </div>
        
        <div className="p-6">
          {!showPasswordForm ? (
            // Show Change Password Button
            <div className="text-center ">
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-6 py-3 bg-[#892580] text-white rounded-xl flex items-center justify-center gap-2 font-medium mx-auto hover:bg-[#7a2170] transition-colors"
              >
                <Shield size={18} />
                Change Password
              </button>
            </div>
          ) : (
            // Show Password Form
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{passwordErrors.currentPassword}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{passwordErrors.newPassword}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{passwordErrors.confirmPassword}</span>
                  </p>
                )}
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  onClick={handlePasswordUpdate}
                  className="flex-1 px-6 py-3 bg-[#892580] text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-[#7a2170] transition-colors"
                >
                  <Shield size={18} />
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    // Reset form and errors
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setPasswordErrors({});
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
        <div className="p-6 border-b border-red-200 bg-red-50">
          <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
          <p className="text-sm text-red-700 mt-1">Irreversible and destructive actions</p>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Delete Account</h4>
              <p className="text-sm text-gray-600 mt-1">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 font-medium">
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="  p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#892580] rounded-xl flex items-center justify-center">
              <Settings className="text-white" size={20} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">Manage your account preferences and business information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-2 sticky top-6">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-[#892580] text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent size={20} />
                      <div className="flex-1">
                        <div className="font-medium">{tab.label}</div>
                        <div className={`text-xs ${activeTab === tab.id ? 'text-white/80' : 'text-gray-500'}`}>
                          {tab.description}
                        </div>
                      </div>
                      {activeTab !== tab.id && <ChevronRight size={16} className="text-gray-400" />}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'business' && renderBusinessTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'security' && renderSecurityTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SettingsPage;