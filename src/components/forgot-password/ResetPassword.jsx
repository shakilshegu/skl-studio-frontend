'use client';
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import Image from 'next/image';
import { verifyResetToken, resetPassword } from '../../services/Authentication/login.service.js'; 

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Verify token on component mount
  const { data: tokenVerification, isLoading: verifyingToken, error: tokenError } = useQuery({
    queryKey: ['verifyResetToken', token],
    queryFn: async () => {
      if (!token) throw new Error('No reset token provided');
      
      const data = await verifyResetToken(token);
      return data;
    },
    enabled: !!token,
    retry: false,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, newPassword, confirmPassword }) => {
      const data = await resetPassword(token, newPassword, confirmPassword);
      return data;
    },
    onSuccess: () => {
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    // Validate passwords
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    await resetPasswordMutation.mutateAsync({
      token,
      newPassword,
      confirmPassword,
    });
  };

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  if (verifyingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#892580] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset token...</p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">{tokenError.message}</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-[#892580] hover:bg-[#892580]/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-row">
      {/* Left side - Image */}
      <div className="relative hidden md:block md:w-3/5 lg:w-2/3">
        <div className="absolute inset-0 bg-gradient-to-br from-[#892580]/90 to-[#892580]/40 z-10 mix-blend-multiply"></div>
        <Image 
          src="/Assets/bok2.png" 
          alt="Aloka" 
          layout="fill" 
          objectFit="cover" 
          priority 
          className="z-0"
        />
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center w-3/4">
          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Secure Reset
          </h2>
          <p className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto">
            Create a new password for your ALOKA account
          </p>
        </div>
      </div>

      {/* Right side - Reset Form */}
      <div className="w-full md:w-2/5 lg:w-1/3 bg-white p-6 md:p-10 lg:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#892580]">ALOKA</h1>
          </div>

          {isSuccess ? (
            // Success State
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Password Reset Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your password has been updated. You will be redirected to the login page shortly.
              </p>
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <p className="text-sm">Redirecting to login in 3 seconds...</p>
              </div>
            </div>
          ) : (
            // Form State
            <>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#892580]/10 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-[#892580]" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
                      Reset Your Password
                    </h2>
                  </div>
                </div>
                <p className="text-gray-600">
                  Please enter your new password below
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div className="relative">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-[#892580] transition-colors">
                    <span className="bg-gray-50 h-full px-4 py-3 text-gray-600 font-medium border-r-2 border-gray-200">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="w-full px-4 py-3 text-gray-700 outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none p-1"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-[#892580] transition-colors">
                    <span className="bg-gray-50 h-full px-4 py-3 text-gray-600 font-medium border-r-2 border-gray-200">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className="w-full px-4 py-3 text-gray-700 outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none p-1"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700 text-sm font-medium mb-2">Password Requirements:</p>
                  <ul className="text-blue-600 text-sm space-y-1">
                    <li className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      At least 6 characters long
                    </li>
                    <li className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${newPassword === confirmPassword && newPassword.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Passwords match
                    </li>
                  </ul>
                </div>

                {/* Error Message */}
                {(passwordError || resetPasswordMutation.error) && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {passwordError || resetPasswordMutation.error?.message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full bg-[#892580] hover:bg-[#892580]/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:ring-opacity-50 disabled:opacity-70"
                >
                  {resetPasswordMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting Password...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="text-[#892580] hover:underline text-sm font-medium"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;