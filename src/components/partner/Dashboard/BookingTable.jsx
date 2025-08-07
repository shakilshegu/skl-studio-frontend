"use client";
import React, { useState } from 'react';
import { Calendar, Clock, User, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { useCurrentBookings, useUpcomingBookings } from '../../../hooks/usePartnerDashboard';

const BookingsTable = ({ currentBookings = [], upcomingBookings = [] }) => {
  const [activeTab, setActiveTab] = useState("Current");
  
  const {
    data: currentBookingsData,
    isLoading: currentLoading,
    error: currentError,
    refetch: refetchCurrent,
    isFetching: currentFetching
  } = useCurrentBookings({ limit: 10 }, { 
    enabled: false, // Disable auto-fetch since we get data from parent
    initialData: { success: true, data: { bookings: currentBookings } }
  });

  const {
    data: upcomingBookingsData,
    isLoading: upcomingLoading,
    error: upcomingError,
    refetch: refetchUpcoming,
    isFetching: upcomingFetching
  } = useUpcomingBookings({ limit: 10 }, { 
    enabled: false, // Disable auto-fetch since we get data from parent
    initialData: { success: true, data: { bookings: upcomingBookings } }
  });

  // Use props data by default, fallback to hook data if needed
  const currentData = currentBookings.length > 0 ? currentBookings : (currentBookingsData?.data?.bookings || []);
  const upcomingData = upcomingBookings.length > 0 ? upcomingBookings : (upcomingBookingsData?.data?.bookings || []);
  
  const bookings = activeTab === "Current" ? currentData : upcomingData;
  const isLoading = activeTab === "Current" ? currentLoading : upcomingLoading;
  const error = activeTab === "Current" ? currentError : upcomingError;
  const isFetching = activeTab === "Current" ? currentFetching : upcomingFetching;
  const refetch = activeTab === "Current" ? refetchCurrent : refetchUpcoming;

  const handleRefresh = () => {
    if (activeTab === "Current") {
      refetchCurrent();
    } else {
      refetchUpcoming();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Calendar className="text-[#892580]" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Bookings</h3>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Tab Switcher */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg">
            {["Current", "Upcoming"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-[#892580] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#892580] bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={16} />
            <span className="text-sm">Error loading {activeTab.toLowerCase()} bookings: {error.message}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="px-6 py-12">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <RefreshCw className="w-8 h-8 mb-4 text-gray-300 animate-spin" />
            <p className="text-lg font-medium">Loading {activeTab.toLowerCase()} bookings...</p>
          </div>
        </div>
      ) : (
        /* Table */
        bookings.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <Calendar className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No {activeTab.toLowerCase()} bookings</p>
              <p className="text-sm">Bookings will appear here when available</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking, index) => (
                  <BookingRow key={booking.bookingId || booking.customBookingId || index} booking={booking} />
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

const BookingRow = ({ booking }) => {
  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Payment status color mapping
  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {booking.avatar ? (
              <img
                src={booking.avatar}
                alt={booking.customerName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <User className="w-5 h-5 text-gray-400" style={{ display: booking.avatar ? 'none' : 'block' }} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{booking.customerName || 'Unknown Customer'}</p>
            {booking.customerEmail && (
              <p className="text-sm text-gray-500">{booking.customerEmail}</p>
            )}
            {booking.customBookingId && (
              <p className="text-xs text-gray-400">ID: {booking.customBookingId}</p>
            )}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">{booking.date}</span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {booking.startTime} - {booking.endTime}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {booking.timeInHrs}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          {booking.status && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          )}
          {booking.paymentStatus && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
              Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
            </span>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#892580] bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
            <Eye size={14} />
            View
          </button>
          {booking.totalAmount && (
            <span className="text-xs text-gray-500">
              ₹{booking.totalAmount.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

export default BookingsTable;