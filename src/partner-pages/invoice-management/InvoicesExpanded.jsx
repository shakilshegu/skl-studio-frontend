import React from 'react';
import { 
  CheckCircle,
  Smartphone,
  Building2,
  Banknote,
  CreditCard,
  DollarSign
} from 'lucide-react';

const InvoiceExpanded = ({ booking }) => {
  const getPaymentModeIcon = (mode) => {
    switch (mode) {
      case 'UPI': return <Smartphone className="w-3 h-3" />;
      case 'Bank Transfer': return <Building2 className="w-3 h-3" />;
      case 'Cash': return <Banknote className="w-3 h-3" />;
      case 'Card': return <CreditCard className="w-3 h-3" />;
      default: return <DollarSign className="w-3 h-3" />;
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Invoices for this Booking</h4>
      <div className="space-y-3">
        {booking.invoices.map((invoice, idx) => (
          <div
            key={idx}
            className={`border rounded-lg p-3 ${
              invoice.status === 'paid' 
                ? 'border-green-200 bg-green-50' 
                : 'border-orange-200 bg-orange-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900">{invoice.invoiceId}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.status === 'paid' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {invoice.status === 'paid' ? '✓ PAID' : '⏳ PENDING'}
                </span>
                <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium capitalize">
                  {invoice.invoiceType}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">
                  ₹{invoice.amount?.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{invoice.description}</p>

            <div className="grid grid-cols-3 gap-4 text-sm">
              {invoice.status === 'paid' ? (
                <>
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Payment Date</span>
                    <p className="font-semibold text-gray-900">
                      {invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Method</span>
                    <div className="flex items-center space-x-1">
                      {getPaymentModeIcon(invoice.paymentMethod)}
                      <span className="font-semibold text-gray-900 capitalize">
                        {invoice.paymentMethod || 'Online'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Transaction ID</span>
                    <p className="font-mono text-gray-900">
                      {invoice.transactionId?.substring(0, 12)}...
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Due Date</span>
                    <p className="font-semibold text-gray-900">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Not Set'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Status</span>
                    <p className="font-semibold text-orange-600">Awaiting Payment</p>
                  </div>
                  <div className="flex items-end">
                    <button className="px-3 py-1 bg-orange-500 text-white rounded text-xs font-medium hover:bg-orange-600 transition-colors">
                      Send Reminder
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceExpanded;