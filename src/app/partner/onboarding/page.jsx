'use client';
import React, { useState } from "react";
import { MapPin, Calendar, Instagram, Award, Camera, ArrowRight, ArrowLeft } from "lucide-react";
import { stateCityData } from "@/utils/BusinessFormData";
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '@/stores/authSlice.js';
import { showToast } from '@/components/Toast/Toast';
import axios from "axios";

const PartnerOnboarding = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    vendorName: "",
    vendorType: "",
    freelancerCategory: "",
    teamSize: 1,
    country: "India",
    state: "",
    city: "",
    instagramHandle: "",
    avgBookingDays: 0,
    inHouseDesigner: "",
    traveledOutsideCountry: false,
    countriesTraveled: [],
    traveledOutsideCity: false,
    citiesTraveled: [],
    openToTravel: true,
    eventsOutsideCity: ["Wedding", "Couple", "Pre-Wedding"],
    eventsOutsideCountry: ["Wedding", "Couple", "Pre-Wedding"],
  });
  
  const [newCountry, setNewCountry] = useState("");
  const [newCity, setNewCity] = useState("");

  const steps = [
    { id: 1, title: "Basic Information", description: "Tell us about your business" },
    { id: 2, title: "Location & Services", description: "Where you operate and what you offer" },
    { id: 3, title: "Travel Preferences", description: "Your availability for travel shoots" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "vendorType" && value === "studio") {
      setFormData(prev => ({
        ...prev,
        freelancerCategory: ""
      }));
    }

    setErrors({ ...errors, [name]: "" });
  };

  const handleTeamSizeChange = (increment) => {
    setFormData({
      ...formData,
      teamSize: Math.max(1, formData.teamSize + increment),
    });
  };

  const handleAvgDaysChange = (increment) => {
    setFormData({
      ...formData,
      avgBookingDays: Math.max(0, formData.avgBookingDays + increment),
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.vendorName) newErrors.vendorName = "Vendor name is required";
      if (!formData.vendorType) newErrors.vendorType = "Vendor type is required";
      if (formData.vendorType === "freelancer" && !formData.freelancerCategory) {
        newErrors.freelancerCategory = "Category is required";
      }
      if (!formData.teamSize) newErrors.teamSize = "Team size is required";
    }

    if (step === 2) {
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.city) newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const token = authData.token;

      const response = await axios.post(
        `${BASE_URL}/partner/business`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.status === 201) {
        dispatch(
          setUser({
            token: token,
            user: response.data.data.user,
            role: response.data.role
          })
        );
        showToast("Welcome! Your business profile has been created successfully!", "success");
        router.push("/partner/dashboard");
      } else {
        showToast(response?.data?.error || "Something went wrong", "error");
      }
    } catch (error) {
      console.error(error);
      showToast(
        error?.response?.data?.error || error?.response?.data?.message || "Failed to save business information",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cities = stateCityData[formData.state] || [];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's set up your business profile</h2>
        <p className="text-gray-600">Tell us about your business so we can customize your experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vendor Name */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Business/Vendor Name
          </label>
          <input
            type="text"
            name="vendorName"
            placeholder="Enter your business name"
            value={formData.vendorName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none transition-colors"
          />
          {errors.vendorName && (
            <p className="mt-1 text-sm text-red-600">{errors.vendorName}</p>
          )}
        </div>

        {/* Register As */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Register as
          </label>
          <div className="relative">
            <select
              name="vendorType"
              value={formData.vendorType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none appearance-none bg-white"
            >
              <option value="">Select Type</option>
              <option value="studio">Studio</option>
              <option value="freelancer">Freelancer</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.vendorType && (
            <p className="mt-1 text-sm text-red-600">{errors.vendorType}</p>
          )}
        </div>

        {/* Freelancer Category */}
        {formData.vendorType === "freelancer" && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <div className="relative">
              <select
                name="freelancerCategory"
                value={formData.freelancerCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none appearance-none bg-white"
              >
                <option value="">Select Category</option>
                <option value="photographer">Photographer</option>
                <option value="videographer">Videographer</option>
                <option value="designer">Designer</option>
                <option value="editor">Editor</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.freelancerCategory && (
              <p className="mt-1 text-sm text-red-600">{errors.freelancerCategory}</p>
            )}
          </div>
        )}

        {/* Team Size */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Team Size
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleTeamSizeChange(-1)}
              className="w-10 h-10 border border-gray-300 rounded-l-lg flex items-center justify-center hover:bg-gray-50 text-gray-600"
            >
              −
            </button>
            <input
              type="text"
              name="teamSize"
              value={formData.teamSize}
              readOnly
              className="w-full h-10 px-4 border-t border-b border-gray-300 text-center bg-gray-50"
            />
            <button
              type="button"
              onClick={() => handleTeamSizeChange(1)}
              className="w-10 h-10 border border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-gray-50 text-gray-600"
            >
              +
            </button>
          </div>
          {errors.teamSize && (
            <p className="mt-1 text-sm text-red-600">{errors.teamSize}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location & Services</h2>
        <p className="text-gray-600">Where do you operate and what services do you offer?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Business Location
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                <span className="mr-2">🇮🇳</span>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full outline-none"
                  readOnly
                />
              </div>
            </div>

            <div className="relative">
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none appearance-none bg-white"
              >
                <option value="">Select State</option>
                {Object.keys(stateCityData).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>

            <div className="relative">
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!formData.state}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none appearance-none bg-white disabled:bg-gray-100"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
          </div>
        </div>

        {/* Instagram Handle */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            <Instagram className="w-4 h-4 inline mr-2" />
            Instagram Handle
          </label>
          <div className="flex">
            <div className="bg-gray-100 px-4 py-3 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
              https://
            </div>
            <input
              type="text"
              name="instagramHandle"
              placeholder="instagram.com/yourbusiness"
              value={formData.instagramHandle}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none"
            />
          </div>
        </div>

        {/* Average Booking Days */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Avg Booking Days/Month
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleAvgDaysChange(-1)}
              className="w-10 h-10 border border-gray-300 rounded-l-lg flex items-center justify-center hover:bg-gray-50 text-gray-600"
            >
              −
            </button>
            <input
              type="text"
              name="avgBookingDays"
              value={formData.avgBookingDays}
              readOnly
              className="w-full h-10 px-4 border-t border-b border-gray-300 text-center bg-gray-50"
            />
            <button
              type="button"
              onClick={() => handleAvgDaysChange(1)}
              className="w-10 h-10 border border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-gray-50 text-gray-600"
            >
              +
            </button>
          </div>
        </div>

        {/* In House Designer */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Do you have an in-house designer?
          </label>
          <div className="relative">
            <select
              name="inHouseDesigner"
              value={formData.inHouseDesigner}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none appearance-none bg-white"
            >
              <option value="">Select Option</option>
              <option value="I outsource">I outsource</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Travel Preferences</h2>
        <p className="text-gray-600">Tell us about your availability for travel shoots</p>
      </div>

      <div className="space-y-8">
        {/* Travel Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Outside Country */}
          <div className="space-y-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                name="traveledOutsideCountry"
                checked={formData.traveledOutsideCountry}
                onChange={handleChange}
                className="mt-1 mr-3 h-4 w-4 text-[#892580] focus:ring-[#892580] border-gray-300 rounded"
                id="traveledOutsideCountry"
              />
              <label htmlFor="traveledOutsideCountry" className="text-gray-700 font-medium">
                Have you traveled outside the country for shoots?
              </label>
            </div>

            {formData.traveledOutsideCountry && (
              <div className="ml-7 space-y-3">
                <label className="block text-sm font-medium text-gray-600">Countries</label>
                {formData.countriesTraveled.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-12">
                    {formData.countriesTraveled.map((country, index) => (
                      <div key={index} className="bg-[#892580]/10 text-[#892580] rounded-lg px-3 py-1 flex items-center text-sm">
                        {country}
                        <button
                          type="button"
                          className="ml-2 text-[#892580]/60 hover:text-[#892580]"
                          onClick={() => {
                            const newCountries = [...formData.countriesTraveled];
                            newCountries.splice(index, 1);
                            setFormData({ ...formData, countriesTraveled: newCountries });
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    placeholder="Enter country name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#892580] text-white rounded-lg hover:bg-[#892580]/90 text-sm"
                    onClick={() => {
                      if (newCountry.trim() !== "") {
                        setFormData({
                          ...formData,
                          countriesTraveled: [...formData.countriesTraveled, newCountry.trim()],
                        });
                        setNewCountry("");
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Outside City */}
          <div className="space-y-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                name="traveledOutsideCity"
                checked={formData.traveledOutsideCity}
                onChange={handleChange}
                className="mt-1 mr-3 h-4 w-4 text-[#892580] focus:ring-[#892580] border-gray-300 rounded"
                id="traveledOutsideCity"
              />
              <label htmlFor="traveledOutsideCity" className="text-gray-700 font-medium">
                Have you traveled outside your city for shoots?
              </label>
            </div>

            {formData.traveledOutsideCity && (
              <div className="ml-7 space-y-3">
                <label className="block text-sm font-medium text-gray-600">Cities</label>
                {formData.citiesTraveled.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-12">
                    {formData.citiesTraveled.map((city, index) => (
                      <div key={index} className="bg-[#892580]/10 text-[#892580] rounded-lg px-3 py-1 flex items-center text-sm">
                        {city}
                        <button
                          type="button"
                          className="ml-2 text-[#892580]/60 hover:text-[#892580]"
                          onClick={() => {
                            const newCities = [...formData.citiesTraveled];
                            newCities.splice(index, 1);
                            setFormData({ ...formData, citiesTraveled: newCities });
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Enter city name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#892580] text-white rounded-lg hover:bg-[#892580]/90 text-sm"
                    onClick={() => {
                      if (newCity.trim() !== "") {
                        setFormData({
                          ...formData,
                          citiesTraveled: [...formData.citiesTraveled, newCity.trim()],
                        });
                        setNewCity("");
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Future Travel */}
        <div className="border-t pt-6">
          <label className="block text-gray-700 font-medium mb-4">
            Are you open to traveling outside your city for work?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="openToTravel"
                value="yes"
                checked={formData.openToTravel === true}
                onChange={() => setFormData({ ...formData, openToTravel: true })}
                className="mr-2 h-4 w-4 text-[#892580] focus:ring-[#892580] border-gray-300"
              />
              <span className="text-gray-700">Yes, I'm open to travel</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="openToTravel"
                value="no"
                checked={formData.openToTravel === false}
                onChange={() => setFormData({ ...formData, openToTravel: false })}
                className="mr-2 h-4 w-4 text-[#892580] focus:ring-[#892580] border-gray-300"
              />
              <span className="text-gray-700">No, I prefer local work</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#892580]">SKL</h1>
              <span className="bg-[#892580] text-white px-3 py-1 rounded-full text-sm font-semibold">
                Partner
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id 
                      ? 'bg-[#892580] text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? '✓' : step.id}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-[#892580]' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-[#892580]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-[#892580] text-white rounded-lg hover:bg-[#892580]/90 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center px-8 py-3 bg-[#892580] text-white rounded-lg hover:bg-[#892580]/90 transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Completing Setup...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerOnboarding;