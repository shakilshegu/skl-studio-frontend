'use client';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { forgotPassword } from '../../services/Authentication/login.service.js'; 

const ForgotPasswordModal = ({ isOpen, onClose, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      const data = await forgotPassword(email);
      return data;
    },
    onSuccess: () => {
      setIsSuccess(true);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      await forgotPasswordMutation.mutateAsync(email);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsSuccess(false);
    forgotPasswordMutation.reset();
    onClose();
  };

  const handleBackToLogin = () => {
    handleClose();
    onBackToLogin();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {isSuccess ? 'Check Your Email' : 'Forgot Password'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            // Success State
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Reset Link Sent!
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your email and follow the instructions to reset your password.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Didn't receive the email?</strong><br />
                  Check your spam folder or try again in a few minutes.
                </p>
              </div>
              <button
                onClick={handleBackToLogin}
                className="w-full bg-[#892580] hover:bg-[#892580]/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Back to Login
              </button>
            </div>
          ) : (
            // Form State
            <>
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-[#892580]/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-[#892580]" />
                </div>
                <p className="text-gray-600 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none transition-colors"
                  />
                </div>

                {forgotPasswordMutation.error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {forgotPasswordMutation.error.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                  className="w-full bg-[#892580] hover:bg-[#892580]/90 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-70"
                >
                  {forgotPasswordMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center text-[#892580] hover:text-[#892580]/80 font-medium py-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;