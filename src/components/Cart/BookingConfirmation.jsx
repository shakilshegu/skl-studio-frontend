"use client";

import React from "react";
import { CheckCircle, Calendar, Clock, Download, Share2 } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";

const BookingConfirmation = ({ bookingData, onClose }) => {
  const router = useRouter();

  // If no booking data is available, show a fallback message
  if (!bookingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 m-4 animate-fadeIn">
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">
              Your booking has been successfully confirmed. You should receive a confirmation email shortly.
            </p>
            <button
              onClick={() => router.push('/user/my-bookings')}
              className="mt-6 w-full bg-[#872980] text-white py-3 rounded-lg hover:bg-[#7D1F72] transition-colors"
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format booking details for display
  const {
    bookingId = "BK" + Math.floor(100000 + Math.random() * 900000),
    entityName = "Studio",
    bookingDates = {},
    paymentAmount,
    paymentType,
    remainingAmount = 0,
  } = bookingData;

  // Format dates for display
  const formattedDates = Object.entries(bookingDates).map(([dateStr, times]) => ({
    date: moment(dateStr).format("ddd, MMM D, YYYY"),
    startTime: times.startTime > 12 ? `${times.startTime-12}PM` : `${times.startTime}AM`,
    endTime: times.endTime > 12 ? `${times.endTime-12}PM` : `${times.endTime}AM`,
    isWholeDay: times.isWholeDay
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-fadeIn relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Success Header */}
        <div className="bg-green-50 rounded-t-xl p-6 border-b">
          <div className="flex items-center">
            <CheckCircle className="h-10 w-10 text-green-500 mr-4" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Booking Confirmed!</h2>
              <p className="text-sm text-gray-600">Your booking has been successfully confirmed</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Booking ID</span>
              <span className="font-medium">{bookingId}</span>
            </div>
            {/* <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Venue</span>
              <span className="font-medium">{entityName}</span>
            </div> */}
          </div>

          {/* Schedule */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Your Schedule</h3>
            <div className="space-y-3">
              {formattedDates.map((booking, index) => (
                <div key={index} className="flex items-start">
                  <Calendar className="h-5 w-5 text-[#872980] mr-2 mt-0.5" />
                  <div>
                    <div className="font-medium">{booking.date}</div>
                    <div className="text-sm text-gray-600">
                      {booking.isWholeDay 
                        ? "Whole Day Booking" 
                        : `${booking.startTime} - ${booking.endTime}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Payment Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Type</span>
                <span className="font-medium">
                  {paymentType === 'advance' ? 'Advance (20%)' : 'Full Payment'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-medium">₹{paymentAmount?.toLocaleString()}</span>
              </div>
              {paymentType === 'advance' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Amount</span>
                  <span className="font-medium">₹{remainingAmount?.toLocaleString()}</span>
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2">
                {paymentType === 'advance' 
                  ? '* Remaining amount to be paid on-site' 
                  : '* Payment completed in full'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="flex-1 flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            <button className="flex-1 flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>

          <button
            onClick={onClose || (() => router.push('/user/my-bookings'))}
            className="w-full bg-[#872980] text-white py-3 rounded-lg hover:bg-[#7D1F72] transition-colors"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;