"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyOTP } from "../../services/Authentication/login.service";
import { useMutation } from "@tanstack/react-query";
import { setUser } from "../../stores/authSlice";
import { showToast } from "../Toast/Toast.jsx";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";

const OtpVerification = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const isPartnerLogin = searchParams.get('isPartnerLogin') === 'true';
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const dispatch = useDispatch();
  const [otpValue, setOtpValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showEmailPasswordForm, setShowEmailPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const mutation = useMutation({
    mutationFn: async (otpString) => {
      console.log("Mutation function called with:", otpString); // Debug log
      setIsLoading(true);
      try {
        const response = await verifyOTP(email, otpString);
        console.log("API Response:", response);
        return response;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
      console.log("Mutation success:", data);
      if (data.success) {
        const authData = JSON.parse(localStorage.getItem("auth") || "{}");
        authData.token = data.token;
        localStorage.setItem("auth", JSON.stringify(authData));

        setIsOtpVerified(true);
        setIsInvalid(false);
        setUserData(data);

        if (data.user.mobile) {
          setShowEmailPasswordForm(false);
          dispatch(
            setUser({
              token: data.token,
              user: data.user,
              role: data.role,
            })
          );

          // Route based on user type
          if (isPartnerLogin) {
            if (!data.isBusinessUser) {
              // Redirect to partner onboarding page
              router.push("/partner/onboarding");
            } else {
              router.push("/partner/dashboard");
            }
          } else {
            router.push("/");
          }
        } else {
          setShowEmailPasswordForm(true);
        }
      } else {
        showToast("Invalid OTP, please try again.", "error");
        setIsInvalid(true);
      }
    },
    onError: () => {
      setIsOtpVerified(false);
      setIsInvalid(true);
      showToast("Failed to verify OTP. Please try again.", "error");
    },
  });

  const handleOtpChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 4) {
      setOtpValue(value);

      if (value.length === 4 && !mutation.isLoading) {
        console.log("Calling verifyOTP with:", value); // Debug log
        mutation.mutate(value);
      }
    }
  };

  const handleResendOtp = () => {
    if (canResend) {
      showToast("OTP resent successfully!", "success");
      setTimer(30);
      setCanResend(false);
    }
  };

  const handleEditPhoneNumber = () => {
    const loginPath = isPartnerLogin ? "/partner/login" : "/login";
    router.push(loginPath);
  };

  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();

    setPhoneError("");
    setPasswordError("");

    if (!phone) {
      setPhoneError("Phone number is required");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const token = userData.token;
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      authData.token = token;
      localStorage.setItem("auth", JSON.stringify(authData));

      const response = await axios.post(
        `${BASE_URL}/auth/update-credentials`,
        { mobile:phone, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        dispatch(
          setUser({
            token: token,
            user: response.data.data.user,
            role: response.data.role,
          })
        );

        showToast("Account setup completed successfully!", "success");

        if (isPartnerLogin) {
          if (userData?.isBusinessUser === false) {
            setShowEmailPasswordForm(false);
            router.push("/partner/onboarding");
          } else {
            router.push("/partner/dashboard");
          }
        } else {
          router.push("/");
        }
      } else {
        showToast(
          response?.data?.error || "Failed to update credentials",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      showToast(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Something went wrong",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const otpDigits = otpValue.padEnd(4, "").split("");

  return (
    <>
      {/* Email and Password Setup Modal */}
      {showEmailPasswordForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Complete Your Account
            </h2>
            <p className="text-gray-600 mb-6">
              Please set up your email and password to secure your account.
            </p>

            <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none transition-colors ${phoneError ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  placeholder="Enter your phone number"
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none transition-colors ${passwordError
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                    }`}
                  placeholder="Create a secure password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none transition-colors ${passwordError
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                    }`}
                  placeholder="Confirm your password"
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#892580] text-white py-3 rounded-lg font-medium hover:bg-[#892580]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#892580] disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Setting up account...
                    </div>
                  ) : (
                    "Complete Setup"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div
        className={`flex min-h-screen w-full ${isPartnerLogin ? "flex-row-reverse" : "flex-row"
          }`}
      >
        {/* Left side - Image */}
        <div className="relative hidden md:block md:w-3/5 lg:w-2/3">
          <div className="absolute inset-0 bg-gradient-to-br from-[#892580]/90 to-[#892580]/40 z-10 mix-blend-multiply"></div>
          <Image
            src="/Assets/bok2.png"
            alt="ALOKA"
            layout="fill"
            objectFit="cover"
            priority
            className="z-0"
          />

          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center w-3/4">
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {isPartnerLogin ? "Partner Verification" : "Verify Your Identity"}
            </h2>
            <p className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto">
              {isPartnerLogin
                ? "We're committed to keeping your business partnership secure"
                : "We're committed to keeping your studio booking experience secure"
              }
            </p>
          </div>
        </div>

        {/* Right side - OTP Form */}
        <div className="w-full md:w-2/5 lg:w-1/3 bg-white p-6 md:p-10 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Logo and partner badge */}
            <div className="flex items-center gap-3 mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#2563EB]">
                SKL
              </h1>
              {isPartnerLogin && (
                <span className="bg-[#2563EB] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Partner
                </span>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-2">
                Verify OTP
              </h2>
              <p className="text-gray-600 mb-1">
                Please enter the 4-digit code sent to
              </p>
              <div className="flex items-center">
                <p className="font-medium text-gray-800">{email}</p>
                <button
                  onClick={handleEditPhoneNumber}
                  className="ml-3 text-[#2563EB] hover:text-[#2563EB]/80 font-medium text-sm underline focus:outline-none"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* OTP Input Section */}
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength="4"
                  value={otpValue}
                  onChange={handleOtpChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="opacity-0 absolute inset-0 w-full h-full z-10 cursor-text"
                  autoFocus
                />

                <div
                  className={`flex justify-between space-x-4 ${isInvalid ? "shake-animation" : ""
                    }`}
                >
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`relative w-full h-16 flex items-center justify-center text-2xl font-bold rounded-xl border-2 transition-all bg-gray-50
                        ${isInvalid
                          ? "border-red-300 bg-red-50"
                          : otpValue.length === index && isFocused
                            ? "border-[#2563EB] shadow-sm"
                            : "border-gray-200"
                        }`}
                      onClick={() => {
                        document.querySelector('input[type="tel"]').focus();
                        setIsFocused(true);
                      }}
                    >
                      {otpDigits[index]}

                      {otpValue.length === index && isFocused && (
                        <div className="h-8 w-0.5 bg-[#2563EB] animate-pulse ml-0.5"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {isInvalid && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Invalid OTP. Please try again.
                </div>
              )}

              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Haven't received the code yet?
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  className={`mt-2 text-sm font-medium focus:outline-none
                    ${canResend
                      ? "text-[#2563EB] hover:text-[#2563EB]/80"
                      : "text-gray-400"
                    }`}
                >
                  {canResend
                    ? "Resend via SMS"
                    : `Resend code in ${timer} seconds`}
                </button>
              </div>

              {isLoading && (
                <div className="flex justify-center mt-4">
                  <div className="loader">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full border-[#892580] animate-spin"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Decorative element */}
            <div className="mt-16 flex justify-center opacity-70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="20"
                viewBox="0 0 100 20"
                fill="none"
              >
                <path
                  d="M0 10C0 4.477 4.477 0 10 0H90C95.523 0 100 4.477 100 10C100 15.523 95.523 20 90 20H10C4.477 20 0 15.523 0 10Z"
                  fill="#F3E8F3"
                />
                <circle
                  cx="50"
                  cy="10"
                  r="6"
                  fill="#892580"
                  fillOpacity="0.3"
                />
                <circle
                  cx="70"
                  cy="10"
                  r="4"
                  fill="#892580"
                  fillOpacity="0.2"
                />
                <circle
                  cx="30"
                  cy="10"
                  r="4"
                  fill="#892580"
                  fillOpacity="0.2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Add CSS for shake animation */}
        <style jsx>{`
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            10%,
            30%,
            50%,
            70%,
            90% {
              transform: translateX(-5px);
            }
            20%,
            40%,
            60%,
            80% {
              transform: translateX(5px);
            }
          }
          .shake-animation {
            animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          }
        `}</style>
      </div>
    </>
  );
};

export default OtpVerification;