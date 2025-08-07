'use client';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendOTP, loginWithCredentials } from "@/services/Authentication/login.service.js";
import { showToast } from '@/components/Toast/Toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setUser } from '@/stores/authSlice.js';
import BusinessForm from '@/partner-pages/business-registration/RegistrationModal.jsx';
import { Eye, EyeOff } from 'lucide-react';
import ForgotPasswordModal from '@/components/forgot-password/ForgotPassword';
import axios from "axios";

const PartnerLoginPage = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const dispatch = useDispatch();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // NEW STATE
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('login');
  const [showBusinessForm, setShowBusinessForm] = useState(false);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const sendOtpMutation = useMutation({
    mutationFn: async ({ phoneNumber }) => {
      const data = await sendOTP(phoneNumber);
      return data;
    },
    onSuccess: (data) => {
      showToast('OTP sent successfully!', 'success');
      const queryParams = new URLSearchParams({
        phoneNumber,
        isPartnerLogin: 'true'
      }).toString();
      router.push(`/otp?${queryParams}`);
    },
    onMutate: () => {
      setError('');
      setIsLoading(true);
    },
    onError: (error) => {
      showToast(error.message || 'Failed to send OTP. Please try again.', 'error');
      setError(error.message || 'Failed to send OTP. Please try again.');
      setIsLoading(false);
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const credentialLoginMutation = useMutation({
    mutationFn: async ({ username, password }) => {
      const data = await loginWithCredentials(username, password, true);
      return data;
    },
    onSuccess: (data) => {  
      dispatch(
        setUser({
          token: data.token,
          user: data.user,
          role: data.role
        }));

      if (data?.isBusinessUser === false) {
        setShowBusinessForm(true);
      } else {
        setShowBusinessForm(false);
        router.push("/partner/dashboard");
      }
    },
    onMutate: () => {
      setError('');
      setIsLoading(true);
    },
    onError: (error) => {
      setError(error.message || 'Invalid username or password. Please try again.');
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loginMethod === 'register') {
      if (phoneNumber.length === 10) {
        await sendOtpMutation.mutateAsync({ phoneNumber });
      } else {
        showToast('Please enter a valid 10-digit phone number.', 'error');
      }
    } else {
      if (username && password) {
        await credentialLoginMutation.mutateAsync({ username, password });
      } else {
        showToast('Please enter both username and password.', 'error');
      }
    }
  };

  const toggleLoginMethod = () => {
    setLoginMethod(loginMethod === 'login' ? 'register' : 'login');
    setError('');
    // Reset password visibility when switching methods
    setShowPassword(false);
  };

  const handleBusinessFormClose = () => {
    setShowBusinessForm(false);
  };

  const handleBusinessFormSubmit = async (formData) => {
    let newToken;
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { token } = JSON.parse(authData);
      newToken = token;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/partner/business`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.status === 201) {
        dispatch(
          setUser({
            token: newToken,
            user: response.data.data.user,
            role: response.data.role
          })
        );
        showToast("Business information saved successfully!", "success");
        router.push("/partner/dashboard");
      } else {
        showToast(response?.data?.error, "error");
      }
    } catch (error) {
      console.error(error);
      showToast(
        error?.response?.data?.error || error?.response?.data?.message,
        "error"
      );
    }
  };

  return (
    <>
      {showBusinessForm && (
        <BusinessForm
          onClose={handleBusinessFormClose}
          onSave={handleBusinessFormSubmit}
        />
      )}
      
      <div className="flex min-h-screen w-full flex-row-reverse">
        {/* Left side - Image (reversed for partner) */}
        <div className="relative hidden md:block md:w-3/5 lg:w-2/3">
          <div className="absolute inset-0 bg-gradient-to-br from-[#892580]/90 to-[#892580]/40 z-10 mix-blend-multiply"></div>
          <Image 
            src="/Assets/bok2.png" 
            alt="Aloka Partner" 
            layout="fill" 
            objectFit="cover" 
            priority 
            className="z-0"
          />
          
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center w-3/4">
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Partner with Us
            </h2>
            <p className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto">
              Grow your studio business with our platform and reach more clients
            </p>
            
            {/* SVG decorative elements */}
            <div className="absolute -top-40 -left-20 opacity-20">
              <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" fill="white" />
              </svg>
            </div>
            <div className="absolute -bottom-40 -right-20 opacity-20">
              <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="80" height="80" rx="10" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-2/5 lg:w-1/3 bg-white p-6 md:p-10 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Logo and partner badge */}
            <div className="flex items-center gap-3 mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#892580]">ALOKA</h1>
              <span className="bg-[#892580] text-white px-4 py-1 rounded-full text-sm font-semibold">
                Partner
              </span>
            </div>

            {/* Login method toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 rounded-full p-1 flex">
                <button
                  onClick={() => setLoginMethod('login')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    loginMethod === 'login'
                    ? 'bg-[#892580] text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setLoginMethod('register')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    loginMethod === 'register'
                    ? 'bg-[#892580] text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-2">
                {loginMethod === 'register' 
                  ? 'Partner Registration' 
                  : 'Partner Login'}
              </h2>
              <p className="text-gray-600">
                {loginMethod === 'register' 
                  ? 'Join as a partner and grow your business with us'
                  : 'Access your partner dashboard'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {loginMethod === 'register' ? (
                <div className="relative">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-[#892580] transition-colors">
                    <span className="bg-gray-50 h-full px-4 py-3 text-gray-600 font-medium border-r-2 border-gray-200">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength="10"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="00000 00000"
                      required
                      className="w-full px-4 py-3 text-gray-700 outline-none"
                    />
                  </div>

                  {/* Phone icon */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                </div>
              ) : (
                // Username and Password fields
                <div className="space-y-4">
                  <div className="relative">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-[#892580] transition-colors">
                      <span className="bg-gray-50 h-full px-4 py-3 text-gray-600 font-medium border-r-2 border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Username or Email"
                        required
                        className="w-full px-4 py-3 text-gray-700 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-[#892580] transition-colors">
                      <span className="bg-gray-50 h-full px-4 py-3 text-gray-600 font-medium border-r-2 border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-3 text-gray-700 outline-none pr-12"
                      />
                      {/* Password toggle button */}
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none p-1"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Forgot password link - UPDATED */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-[#892580] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
              )}

              {loginMethod === 'register' && (
                <div className="space-y-3">
                  <p className="text-gray-500 text-sm">
                    Note: By proceeding, you consent to get calls, WhatsApp, or SMS messages, including by automated means.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Partner Benefits:</strong> Access to dashboard, business analytics, customer management, and more!
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#892580] hover:bg-[#892580]/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:ring-opacity-50 disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {loginMethod === 'register' ? 'Sending OTP...' : 'Logging in...'}
                    </div>
                  ) : (
                    loginMethod === 'register' ? "Get Verification Code" : "Partner Login"
                  )}
                </button>

                {/* Login/Register toggle link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleLoginMethod}
                    className="text-[#892580] hover:underline text-sm font-medium"
                  >
                    {loginMethod === 'login' 
                      ? "New partner? Register now"
                      : "Already a partner? Login here"}
                  </button>
                </div>

                {/* User login link */}
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">Not a business?</p>
                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="w-full border-2 border-[#892580] text-[#892580] hover:bg-[#892580]/5 font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#892580] focus:ring-opacity-50"
                  >
                    User Login
                  </button>
                </div>
              </div>
            </form>

            {/* Decorative element */}
            <div className="mt-16 flex justify-center opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="20" viewBox="0 0 100 20" fill="none">
                <path d="M0 10C0 4.477 4.477 0 10 0H90C95.523 0 100 4.477 100 10C100 15.523 95.523 20 90 20H10C4.477 20 0 15.523 0 10Z" fill="#F3E8F3"/>
                <circle cx="50" cy="10" r="6" fill="#892580" fillOpacity="0.3"/>
                <circle cx="70" cy="10" r="4" fill="#892580" fillOpacity="0.2"/>
                <circle cx="30" cy="10" r="4" fill="#892580" fillOpacity="0.2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal - NEW */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    </>
  );
};

export default PartnerLoginPage;