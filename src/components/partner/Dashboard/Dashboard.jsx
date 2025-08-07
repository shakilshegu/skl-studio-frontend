"use client";
import React from "react";
import { BarChart3, RefreshCw, AlertCircle } from "lucide-react";
import DashboardStatsCards from "./Stats";
import RevenueSection from "./RevenueSection";
import BookingsTable from "./BookingTable";
import { useDashboard } from "../../../hooks/usePartnerDashboard";

const DashboardPage = () => {
  const { 
    data: dashboardData, 
    isLoading, 
    error, 
    refetch,
    isFetching
  } = useDashboard();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="mx-auto space-y-8">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-[#892580] to-purple-600 p-3 rounded-xl">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Loading your business overview...</p>
            </div>
          </div>

          {/* Loading skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue section skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>

          {/* Bookings table skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="mx-auto space-y-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-[#892580] to-purple-600 p-3 rounded-xl">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your business overview</p>
            </div>
          </div>

          {/* Error message */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={24} />
              <h3 className="text-lg font-semibold text-red-800">Error Loading Dashboard</h3>
            </div>
            <p className="text-red-700 mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract data with fallbacks
  const { stats, currentBookings, upcomingBookings, revenueData } = dashboardData?.data || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#892580] to-purple-600 p-3 rounded-xl">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your business overview</p>
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Cards */}
        <DashboardStatsCards stats={stats} />

        {/* Revenue Section */}
        <RevenueSection revenueData={revenueData} />

        {/* Bookings Table */}
        <BookingsTable 
          currentBookings={currentBookings || []}
          upcomingBookings={upcomingBookings || []}
        />
      </div>
    </div>
  );
};

export default DashboardPage;