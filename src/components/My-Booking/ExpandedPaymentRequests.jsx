import React from 'react';
import moment from 'moment';
import { Bell, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const ExpandedPaymentRequests = ({ 
  paymentRequests, 
  onPaymentFromRequest, 
  onDeclineRequest,
  bookingId,
  formatCurrency 
}) => {
  // Payment request status configuration
  const getRequestStatusConfig = (customerStatus) => {
    const configs = {
      pending: { 
        label: 'New Request', 
        color: 'bg-blue-100 text-blue-800',
        icon: Bell
      },
      sent: { 
        label: 'Action Required', 
        color: 'bg-orange-100 text-orange-800',
        icon: AlertCircle
      },
      paid: { 
        label: 'Paid', 
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      declined: { 
        label: 'Declined', 
        color: 'bg-red-100 text-red-800',
        icon: XCircle
      }
    };
    return configs[customerStatus] || configs.pending;
  };

  if (!paymentRequests || paymentRequests.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
      <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
        Payment Requests
      </h4>
      <div className="space-y-3 sm:space-y-4">
        {paymentRequests.map((request, idx) => {
          const requestConfig = getRequestStatusConfig(request.customerStatus);
          const RequestIcon = requestConfig.icon;
          
          return (
            <div
              key={idx}
              className={`border rounded-lg sm:rounded-xl p-3 sm:p-4 ${
                request.customerStatus === 'sent' 
                  ? 'border-orange-200 bg-orange-50' 
                  : request.customerStatus === 'paid'
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">
                    {request.customRequestId}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${requestConfig.color}`}>
                    <RequestIcon className="w-3 h-3" />
                    {requestConfig.label}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-purple-100 text-purple-600 text-xs font-medium capitalize">
                    {request.reminderType} Reminder
                  </span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatCurrency(request.amount)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                {request.message}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Requested By
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {request.requestedBy.name}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Request Date
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {moment(request.createdAt).format('MMM DD, YYYY')}
                  </span>
                </div>
                <div className="flex items-end col-span-1 sm:col-span-2 lg:col-span-1">
                  {request.customerStatus === 'sent' ? (
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <button 
                        onClick={() => onPaymentFromRequest(request, bookingId)}
                        className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors"
                      >
                        Pay Now
                      </button>
                      <button 
                        onClick={() => onDeclineRequest(request)}
                        className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-400 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  ) : request.customerStatus === 'paid' ? (
                    <span className="text-green-600 font-medium text-xs sm:text-sm">✓ Paid</span>
                  ) : request.customerStatus === 'declined' ? (
                    <span className="text-red-600 font-medium text-xs sm:text-sm">✗ Declined</span>
                  ) : (
                    <span className="text-gray-600 font-medium text-xs sm:text-sm">Pending</span>
                  )}
                </div>
              </div>

              {/* Show payment details if paid */}
              {request.customerStatus === 'paid' && request.customerRespondedAt && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Paid on {moment(request.customerRespondedAt).format('MMM DD, YYYY')}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpandedPaymentRequests;