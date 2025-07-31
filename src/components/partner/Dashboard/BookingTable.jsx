"use client";
import React, { useState } from 'react';
import { Calendar, Clock, User, Eye } from 'lucide-react';

const BookingsTable = ({ currentBookings = [], upcomingBookings = [] }) => {
  const [activeTab, setActiveTab] = useState("Current");

  const bookings = activeTab === "Current" ? currentBookings : upcomingBookings;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Calendar className="text-[#892580]" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Bookings</h3>
        </div>
        
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
      </div>

      {/* Table */}
      {bookings.length === 0 ? (
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking, index) => (
                <BookingRow key={index} booking={booking} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const BookingRow = ({ booking }) => {
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
              />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{booking.customerName}</p>
            {booking.customerEmail && (
              <p className="text-sm text-gray-500">{booking.customerEmail}</p>
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
        <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#892580] bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
          <Eye size={14} />
          View
        </button>
      </td>
    </tr>
  );
};

export default BookingsTable;