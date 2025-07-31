import React from 'react';
import { 
  MessageSquare,
  Plus,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Eye,
  Loader2
} from 'lucide-react';

const RequestsExpanded = ({ 
  booking, 
  paymentRequests = [], 
  requestsLoading = false,
  onNewRequest,
  onCancelRequest 
}) => {
  const getRequestStatusColor = (request) => {
    if (request.cancelled) return 'bg-gray-100 text-gray-700';
    if (request.customerStatus === 'paid') return 'bg-green-100 text-green-700';
    if (request.customerStatus === 'declined') return 'bg-red-100 text-red-700';
    if (request.customerStatus === 'sent') return 'bg-purple-100 text-purple-700';
    if (request.adminStatus === 'rejected') return 'bg-red-100 text-red-700';
    if (request.adminStatus === 'approved') return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getRequestStatusText = (request) => {
    if (request.cancelled) return 'Cancelled';
    if (request.customerStatus === 'paid') return 'Payment Received';
    if (request.customerStatus === 'declined') return 'Declined by Customer';
    if (request.customerStatus === 'sent') return 'Sent to Customer';
    if (request.adminStatus === 'rejected') return 'Rejected by Admin';
    if (request.adminStatus === 'approved') return 'Approved';
    return 'Pending Approval';
  };

  const getRequestStatusIcon = (request) => {
    if (request.cancelled) return <XCircle className="w-3 h-3" />;
    if (request.customerStatus === 'paid') return <CheckCircle className="w-3 h-3" />;
    if (request.customerStatus === 'declined') return <XCircle className="w-3 h-3" />;
    if (request.customerStatus === 'sent') return <Send className="w-3 h-3" />;
    if (request.adminStatus === 'rejected') return <XCircle className="w-3 h-3" />;
    if (request.adminStatus === 'approved') return <CheckCircle className="w-3 h-3" />;
    return <Clock className="w-3 h-3" />;
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-purple-600" />
          <span>Payment Requests</span>
        </h4>
        {/* <button
          onClick={() => onNewRequest(booking.bookingId)}
          className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-xs font-medium hover:bg-purple-600 transition-colors flex items-center space-x-1"
        >
          <Plus className="w-3 h-3" />
          <span>New Request</span>
        </button> */}
      </div>
      
      {requestsLoading ? (
        <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading payment requests...</p>
          </div>
        </div>
      ) : paymentRequests.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-dashed border-purple-200">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-purple-500" />
          </div>
          <h5 className="text-lg font-semibold text-gray-900 mb-2">No payment requests yet</h5>
          <p className="text-sm text-gray-600 mb-4">Send your first payment request to get started</p>
          <button
            onClick={() => onNewRequest(booking.bookingId)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Send className="w-4 h-4" />
            <span>Send First Request</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentRequests.map((request, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200"
            >
              {/* Request Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-semibold text-gray-900">{request.requestId}</h5>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getRequestStatusColor(request)}`}>
                        {getRequestStatusIcon(request)}
                        <span>{getRequestStatusText(request)}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium capitalize">
                        {request.reminderType} Reminder
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">₹{request.amount?.toLocaleString()}</p>
                  {request.specificInvoiceId && (
                    <p className="text-xs text-gray-500">Invoice: {request.specificInvoiceId}</p>
                  )}
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  {/* Step 1: Admin Review */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      request.adminStatus === 'pending' ? 'bg-yellow-400' : 
                      request.adminStatus === 'approved' ? 'bg-green-400' : 'bg-red-400'
                    }`}>
                      {request.adminStatus === 'approved' ? (
                        <CheckCircle className="w-2 h-2 text-white" />
                      ) : request.adminStatus === 'rejected' ? (
                        <XCircle className="w-2 h-2 text-white" />
                      ) : (
                        <Clock className="w-2 h-2 text-white" />
                      )}
                    </div>
                    <span className={`text-xs font-medium ${
                      request.adminStatus === 'pending' ? 'text-yellow-700' : 
                      request.adminStatus === 'approved' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      Admin Review
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className={`h-0.5 flex-1 mx-3 ${
                    request.adminStatus === 'approved' ? 'bg-green-300' : 'bg-gray-200'
                  }`}></div>

                  {/* Step 2: Send to Customer */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      request.customerStatus === 'sent' || request.customerStatus === 'paid' ? 'bg-purple-400' : 'bg-gray-300'
                    }`}>
                      {request.customerStatus === 'sent' || request.customerStatus === 'paid' ? (
                        <Send className="w-2 h-2 text-white" />
                      ) : (
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${
                      request.customerStatus === 'sent' || request.customerStatus === 'paid' ? 'text-purple-700' : 'text-gray-500'
                    }`}>
                      Sent to Client
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className={`h-0.5 flex-1 mx-3 ${
                    request.customerStatus === 'paid' ? 'bg-green-300' : 'bg-gray-200'
                  }`}></div>

                  {/* Step 3: Payment Received */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      request.customerStatus === 'paid' ? 'bg-green-400' : 'bg-gray-300'
                    }`}>
                      {request.customerStatus === 'paid' ? (
                        <CheckCircle className="w-2 h-2 text-white" />
                      ) : (
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${
                      request.customerStatus === 'paid' ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      Payment Received
                    </span>
                  </div>
                </div>
              </div>

              {/* Request Message Preview */}
              {/* {request.message && (
                <div className="mb-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Message Preview</span>
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        View Full Message
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {request.message.length > 200 
                        ? `${request.message.substring(0, 200)}...` 
                        : request.message
                      }
                    </p>
                  </div>
                </div>
              )} */}

              {/* Admin Notes */}
              {request.adminNotes && (
                <div className="mb-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Admin Notes</span>
                    </div>
                    <p className="text-sm text-blue-800">{request.adminNotes}</p>
                  </div>
                </div>
              )}

              {/* Request Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Updated: {new Date(request.updatedAt || request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Show different actions based on status */}
                  {request.adminStatus === 'pending' && !request.cancelled && (
                    <button
                      onClick={() => onCancelRequest(request.requestId)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors flex items-center space-x-1"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                  )}

                  {request.adminStatus === 'approved' && request.customerStatus !== 'sent' && (
                    <div className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      <span>Ready to Send</span>
                    </div>
                  )}

                  {request.customerStatus === 'sent' && request.customerStatus !== 'paid' && (
                    <div className="flex items-center space-x-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                      <Send className="w-3 h-3" />
                      <span>Sent to Client</span>
                    </div>
                  )}

                  {request.customerStatus === 'paid' && (
                    <div className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      <span>Payment Received</span>
                    </div>
                  )}

                  {/* View Details Button */}
                  {/* <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>Details</span>
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsExpanded;