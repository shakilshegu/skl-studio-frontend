import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProfileDetails,
  updateProfileDetails,
  createProfile,
} from "@/services/Profile/profile.service";
import Profile from "../../../public/Assets/svg/Profile";
import { showToast } from "../Toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser, updateUser } from "@/stores/authSlice";
import { X, Camera, Edit3, Save, User, MapPin, Mail, Phone, Calendar } from "lucide-react";

const ProfileModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);
  
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: user?.mobile || "+91",
    gender: "",
    dateOfBirth: "",
    profileImage: null,
  });
  
  const userId = user?._id;

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfileDetails(userId),
    enabled: isOpen && !!userId,
  });

  // Update form data when profile data or user changes
  useEffect(() => {
    if (profileData?.data) {
      const profile = profileData.data;
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.userId?.email || user?.email || "",
        phone: profile.userId?.mobile || user?.mobile || "+91",
        gender: profile.gender || "",
        dateOfBirth: profile.dateOfBirth?.split("T")[0] || "",
        profileImage: null,
      });
      if (profile.profilePhoto) {
        setPreviewImage(profile.profilePhoto);
      }
    } else if (user) {
      // If no profile data, use user data from Redux
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.mobile || "+91"
      }));
      if (user.profilePhoto) {
        setPreviewImage(user.profilePhoto);
      }
    }
  }, [profileData, user]);

  const prepareFormData = (data) => {
    const form = new FormData();
    console.log("data into form Setting", data);
    if (data.firstName) form.append("firstName", data.firstName);
    if (data.lastName) form.append("lastName", data.lastName);
    if (data.email) form.append("email", data.email);
    if (data.phone) form.append("mobile", data.phone);
    if (data.gender) form.append("gender", data.gender);
    if (data.dateOfBirth) form.append("dateOfBirth", data.dateOfBirth);
    if (data.profileImage instanceof File) {
      form.append("profilePhoto", data.profileImage);
    }
    return form;
  };

  const updateProfileMutation = useMutation({
    mutationFn: (form) => updateProfileDetails(form),
    onSuccess: (data) => {
      if (data?.success) {
        // Update Redux store with the new user data
        const updatedUser = {
          ...user,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          profilePhoto: data.data.profilePhoto,
          gender: data.data.gender,
          dateOfBirth: data.data.dateOfBirth,
          // Keep existing user data and merge with profile data
          ...data.data
        };
        
        dispatch(updateUser({ user: updatedUser }));
        queryClient.invalidateQueries(["profile", userId]);
        setIsEditable(false);
        showToast("Profile updated successfully!", "success");
        onClose();
      }
    },
    onError: (error) => {
      console.log(error);
      showToast(
        error?.response?.data?.message || "Failed to update profile.",
        "error"
      );
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: (form) => createProfile(form),
    onSuccess: (data) => {
      if (data?.success) {
        // Update Redux store with the new user data
        const updatedUser = {
          ...user,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          profilePhoto: data.data.profilePhoto,
          gender: data.data.gender,
          dateOfBirth: data.data.dateOfBirth,
          // Keep existing user data and merge with profile data
          ...data.data
        };
        
        dispatch(updateUser({ user: updatedUser }));
        queryClient.invalidateQueries(["profile", userId]);
        setIsEditable(false);
        showToast("Profile created successfully!", "success");
        onClose();
      }
    },
    onError: (error) => {
      showToast(
        error?.response?.data?.message || "Failed to create profile.",
        "error"
      );
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasProfile = profileData?.data;
    const form = prepareFormData(formData);

    if (hasProfile) {
      updateProfileMutation.mutate(form);
    } else {
      createProfileMutation.mutate(form);
    }
  };

  const handleClose = () => {
    setIsEditable(false);
    onClose();
  };

  if (!isOpen) return null;
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#892580]"></div>
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2563EB] via-[#b84397] to-[#d946ef] p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Profile Information</h2>
                <p className="text-white/80 text-sm">Manage your personal details</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditable((prev) => !prev)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isEditable 
                    ? 'bg-white/20 hover:bg-white/30' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {isEditable ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center py-8 bg-gradient-to-b from-gray-50 to-white border-b">
          <div className="relative group">
            <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Profile />
              )}
            </div>
            {isEditable && (
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#a13399] transition-all shadow-lg group-hover:scale-110">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {isEditable && (
            <p className="mt-3 text-sm text-gray-500 text-center">Click the camera icon to change photo</p>
          )}
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4 text-[#2563EB]" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl transition-all outline-none ${
                    isEditable 
                      ? 'border-gray-300 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                  disabled={!isEditable}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4 text-[#2563EB]" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl transition-all outline-none ${
                    isEditable 
                      ? 'border-gray-300 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                  disabled={!isEditable}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Mail className="w-4 h-4 text-[#2563EB]" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="Email address"
                />
                <p className="text-xs text-gray-400">Email cannot be changed</p>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="Mobile number"
                />
                <p className="text-xs text-gray-400">Mobile cannot be changed</p>
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <User className="w-4 h-4 text-[#2563EB]" />
                Gender
              </label>
              <div className="flex flex-wrap gap-4">
                {["Male", "Female", "Other"].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={formData.gender === option}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className="w-4 h-4 text-[#2563EB] border-gray-300 focus:ring-[#2563EB] disabled:opacity-50"
                    />
                    <span className={`text-sm transition-colors ${
                      !isEditable ? "text-gray-500" : "text-gray-700 group-hover:text-[#2563EB]"
                    }`}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-[#892580]" />
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl transition-all outline-none ${
                  isEditable 
                    ? 'border-gray-300 focus:ring-2 focus:ring-[#892580] focus:border-transparent' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
                disabled={!isEditable}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        {isEditable && (
          <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditable(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={updateProfileMutation.isLoading || createProfileMutation.isLoading}
              className="px-6 py-3 bg-gradient-to-r from-[#892580] to-[#b84397] text-white rounded-xl hover:from-[#7a2073] hover:to-[#a63d88] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
            >
              {updateProfileMutation.isLoading || createProfileMutation.isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {profileData?.data ? "Update Profile" : "Create Profile"}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;