


import React from 'react';
import moment from 'moment';

const ExpandedInvoiceDetails = ({ 
  invoices, 
  onPayment, 
  bookingId,
  formatCurrency 
}) => {


  if (!invoices || invoices.length === 0) {
    return null;
  }

  // ✅ Helper function to get status styling
  const getStatusStyling = (status) => {
    switch (status) {
      case 'paid':
        return {
          border: 'border-green-200 bg-green-50',
          badge: 'bg-green-100 text-green-700',
          badgeText: '✓ PAID'
        };
      case 'refunded':
        return {
          border: 'border-blue-200 bg-blue-50',
          badge: 'bg-blue-100 text-blue-700',
          badgeText: '↩ REFUNDED'
        };
      case 'pending':
      default:
        return {
          border: 'border-orange-200 bg-orange-50',
          badge: 'bg-orange-100 text-orange-700',
          badgeText: '⏳ PENDING'
        };
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
      <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
        Invoice Details
      </h4>
      <div className="space-y-3 sm:space-y-4">
        {invoices.map((invoice, idx) => {
          const statusStyle = getStatusStyling(invoice.status);
          
          return (
            <div
              key={idx}
              className={`border rounded-lg sm:rounded-xl p-3 sm:p-4 ${statusStyle.border}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">
                    {invoice.invoiceId}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.badge}`}>
                    {statusStyle.badgeText}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium capitalize">
                    {invoice.invoiceType}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </span>
                  {/* ✅ Show refund amount if refunded */}
                  {invoice.status === 'refunded' && invoice.refundAmount && (
                    <span className="text-sm text-blue-600 font-medium">
                      Refunded: {formatCurrency(invoice.refundAmount)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                {invoice.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* ✅ PAID STATUS - Show payment details */}
                {invoice.status === 'paid' && (
                  <>
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Payment Date
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {moment(invoice.paidAt).format('MMM DD, YYYY')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Method
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 capitalize">
                        {invoice.paymentMethod || 'Online'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Transaction ID
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-gray-900">
                        {invoice.transactionId?.substring(0, 12)}...
                      </span>
                    </div>
                  </>
                )}

                {/* ✅ REFUNDED STATUS - Show payment + refund details */}
                {invoice.status === 'refunded' && (
                  <>
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Original Payment
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {moment(invoice.paidAt).format('MMM DD, YYYY')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Refund Date
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-blue-600">
                        {moment(invoice.refundedAt).format('MMM DD, YYYY')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Refund ID
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-blue-600">
                        {invoice.refundId}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Transaction ID
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-gray-900">
                        {invoice.transactionId}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Refund Reason
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 capitalize">
                        {invoice.refundReason || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Payment Method
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 capitalize">
                        {invoice.paymentMethod || 'Online'}
                      </span>
                    </div>
                  </>
                )}

                {/* ✅ PENDING STATUS - Show due date and pay button */}
                {invoice.status === 'pending' && (
                  <>
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Due Date
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {moment(invoice.dueDate).format('MMM DD, YYYY')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Status
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-orange-600">
                        Awaiting Payment
                      </span>
                    </div>
                    <div className="flex items-end col-span-1 sm:col-span-2 lg:col-span-1">
                      <button 
                        onClick={() => onPayment(bookingId)}
                        className="w-full px-3 py-2 bg-orange-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors"
                      >
                        Pay Now
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* ✅ REFUND TIMELINE - Show refund process timeline for refunded invoices */}
              {invoice.status === 'refunded' && (
                <div className="mt-4 pt-3 border-t border-blue-100">
                  <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Refund Timeline
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="font-medium">Payment Received:</span>
                      <span className="ml-1">{moment(invoice.paidAt).format('MMM DD, YYYY [at] h:mm A')}</span>
                    </div>
                    <div className="flex items-center text-xs text-blue-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      <span className="font-medium">Refund Processed:</span>
                      <span className="ml-1">{moment(invoice.refundedAt).format('MMM DD, YYYY [at] h:mm A')}</span>
                    </div>
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

export default ExpandedInvoiceDetails;