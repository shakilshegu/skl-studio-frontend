"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Download, 
  DollarSign, 
  Phone, 
  Mail, 
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Receipt,
  Plus,
  Send,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from "lucide-react";
import { getMyBookings } from "@/services/Booking/partner.bookings.service";
import { getRequestsByBooking } from "@/services/Invoice/invoice.services";
import CreateInvoiceModal from "./CreateInvoiceModal";
import AddPaymentModal from "./AddPaymentModal";
import RequestPaymentModal from "./RequestPaymentModal";
import InvoiceExpanded from "./InvoicesExpanded";
import RequestsExpanded from "./RequestsExpanded";
import { showToast } from "@/components/Toast/Toast";


const InvoiceManagement = () => {
  const router = useRouter();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [expandedSection, setExpandedSection] = useState('invoices');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showRequestPaymentModal, setShowRequestPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch bookings data
  const { data: bookingsData, isLoading, isError, error } = useQuery({
    queryKey: ["partnerBookings"],
    queryFn: getMyBookings,
  });

  // Fetch payment requests for expanded booking
  const { data: paymentRequestsData, isLoading: requestsLoading } = useQuery({
    queryKey: ["paymentRequests", expandedBooking],
    queryFn: () => getRequestsByBooking(expandedBooking),
    enabled: !!expandedBooking && expandedSection === 'requests',
  });

  // Transform bookings data
  const allBookings = useMemo(() => {
    if (!bookingsData?.data) return [];
    
    return bookingsData.data.map(booking => {
      const invoices = booking.paymentSummary?.invoices || [];
      if (invoices.length === 0) return null;
      
      const quotedAmount = booking.paymentSummary?.totalAmount || booking.totalAmount || 0;
      const receivedAmount = booking.paymentSummary?.totalPaid || 0;
      const pendingAmount = booking.paymentSummary?.pendingAmount || 0;
      
      let bookingStatus = 'pending';
      if (booking.status === 'confirmed' || booking.status === 'in-progress') {
        bookingStatus = 'accepted';
      } else if (booking.status === 'completed') {
        bookingStatus = 'completed';
      }

      return {
        id: booking._id,
        clientName: booking.userDetails?.name || 'Unknown Client',
        phone: booking.userDetails?.mobile || 'N/A',
        email: booking.userDetails?.email || 'N/A',
        service: booking.serviceType || 'Photography Service',
        status: bookingStatus,
        quotedAmount,
        receivedAmount,
        pendingAmount,
        date: booking.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        invoiceGenerated: invoices.length > 0,
        customBookingId: booking.customBookingId,
        bookingId: booking._id,
        booking,
        invoices
      };
    }).filter(Boolean);
  }, [bookingsData]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return allBookings.filter(booking => {
      const matchesSearch = booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.phone.includes(searchTerm) ||
                           booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.customBookingId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allBookings, searchTerm, statusFilter]);

  // Calculate summary
  const summary = useMemo(() => {
    const total = allBookings.reduce((acc, booking) => ({
      quoted: acc.quoted + booking.quotedAmount,
      received: acc.received + booking.receivedAmount,
      pending: acc.pending + booking.pendingAmount
    }), { quoted: 0, received: 0, pending: 0 });

    return {
      ...total,
      totalLeads: allBookings.length,
      acceptedLeads: allBookings.filter(b => b.status === 'accepted').length,
      completedLeads: allBookings.filter(b => b.status === 'completed').length,
      pendingLeads: allBookings.filter(b => b.status === 'pending').length
    };
  }, [allBookings]);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  // Event handlers
  const handleAddPayment = (bookingId) => {
    const booking = allBookings.find(b => b.bookingId === bookingId);
    setSelectedBooking(booking);
    setShowAddPaymentModal(true);
  };

  const handlePaymentRequest = (bookingId) => {
    const booking = allBookings.find(b => b.bookingId === bookingId);
    setSelectedBooking(booking);
    setShowRequestPaymentModal(true);
  };

  const handleDownload = (bookingId) => {
    console.log('Download invoice for booking:', bookingId);
    showToast('Download functionality - integrate with your PDF generator');
  };

  const toggleExpanded = (bookingId, section = 'invoices') => {
    if (expandedBooking === bookingId && expandedSection === section) {
      setExpandedBooking(null);
      setExpandedSection('invoices');
    } else {
      setExpandedBooking(bookingId);
      setExpandedSection(section);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!confirm('Are you sure you want to cancel this payment request?')) return;

    try {
      console.log('Cancelling request:', requestId);
      showToast('Payment request cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling request:', error);
      showToast('Failed to cancel request. Please try again.',"error");
    }
  };

  const handleCreateInvoice = async (invoiceData) => {
    try {
      console.log('Creating invoice:', invoiceData);
      showToast('Invoice created successfully!');
    } catch (error) {
      console.error('Error creating invoice:', error);
      showToast('Failed to create invoice. Please try again.',"error");
    }
  };

  const handleAddPaymentSubmit = async (paymentData) => {
    try {
      console.log('Recording payment:', paymentData);
      showToast('Payment recorded successfully!');
    } catch (error) {
      console.error('Error recording payment:', error);
      showToast('Failed to record payment. Please try again.',"error");
    }
  };

  const handlePaymentRequestSubmit = async (requestData) => {
    try {
      console.log('Sending payment request:', requestData);
      showToast('Payment request sent successfully!');
    } catch (error) {
      console.error('Error sending payment request:', error);
      showToast('Failed to send payment request. Please try again.',"error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#892580]" />
          <span className="text-gray-600">Loading invoices...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to load invoices</h3>
        <p className="text-red-600">{error?.message}</p>
      </div>
    );
  }

  const paymentRequests = paymentRequestsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-[#892580] text-white px-4 py-2.5 rounded-lg hover:bg-[#a12d8a] transition-colors flex items-center space-x-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Quoted</p>
              <p className="text-2xl font-bold text-gray-900">₹{summary.quoted.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Received</p>
              <p className="text-2xl font-bold text-green-600">₹{summary.received.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Pending</p>
              <p className="text-2xl font-bold text-orange-600">₹{summary.pending.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Leads</p>
              <p className="text-2xl font-bold text-purple-600">{summary.totalLeads}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, phone, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent text-sm bg-white min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-all duration-200">
            <div className="p-4">
              <div className="flex items-center justify-between">
                {/* Left Side - Booking Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#892580] to-[#a12d8a] rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {booking.clientName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-900">{booking.clientName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{booking.service}</p>
                    
                    <div className="flex items-center space-x-6 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Receipt className="w-3 h-3" />
                        <span>{booking.customBookingId}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{booking.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{booking.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Payment Info & Actions */}
                <div className="text-right">
                  {/* Payment Amounts */}
                  <div className="flex justify-between items-center w-[400px] mb-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium mb-1 whitespace-nowrap">Quoted Amount</p>
                      <p className="text-lg font-bold text-gray-900">₹{booking.quotedAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-medium mb-1 whitespace-nowrap">Received</p>
                      <p className="text-lg font-bold text-green-600">₹{booking.receivedAmount.toLocaleString()}</p>
                    </div>
                    {booking.pendingAmount > 0 && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 font-medium mb-1 whitespace-nowrap">Pending</p>
                        <p className="text-lg font-bold text-orange-600">₹{booking.pendingAmount.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-2">
                    {booking.status === 'accepted' && booking.pendingAmount > 0 && (
                      <button
                        onClick={() => handleAddPayment(booking.bookingId)}
                        className="px-2 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center space-x-1 text-xs font-medium"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Payment</span>
                      </button>
                    )}

                    {booking.pendingAmount > 0 && (
                      <button
                        onClick={() => handlePaymentRequest(booking.bookingId)}
                        className="px-2 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center space-x-1 text-xs font-medium"
                      >
                        <Send className="w-3 h-3" />
                        <span>Request Payment</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDownload(booking.bookingId)}
                      className="px-2 py-1.5 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors flex items-center space-x-1 text-xs font-medium"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>

                    {/* Expand Invoices Button */}
                    <button
                      onClick={() => toggleExpanded(booking.id, 'invoices')}
                      className={`px-2 py-1.5 rounded-md transition-colors flex items-center space-x-1 text-xs font-medium ${
                        expandedBooking === booking.id && expandedSection === 'invoices'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {expandedBooking === booking.id && expandedSection === 'invoices' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                      <span>{booking.invoices.length} Invoice{booking.invoices.length !== 1 ? 's' : ''}</span>
                    </button>

                    {/* Expand Requests Button */}
                    <button
                      onClick={() => toggleExpanded(booking.id, 'requests')}
                      className={`px-2 py-1.5 rounded-md transition-colors flex items-center space-x-1 text-xs font-medium ${
                        expandedBooking === booking.id && expandedSection === 'requests'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {expandedBooking === booking.id && expandedSection === 'requests' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                      <MessageSquare className="w-3 h-3" />
                      <span>Requests</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* EXPANDED SECTIONS - Using Separate Components */}
              {expandedBooking === booking.id && expandedSection === 'invoices' && (
                <InvoiceExpanded booking={booking} />
              )}

              {expandedBooking === booking.id && expandedSection === 'requests' && (
                <RequestsExpanded 
                  booking={booking}
                  paymentRequests={paymentRequests}
                  requestsLoading={requestsLoading}
                  onNewRequest={handlePaymentRequest}
                  onCancelRequest={handleCancelRequest}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-sm text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters to see more results.' 
              : 'Bookings with invoices will appear here.'
            }
          </p>
        </div>
      )}

      {/* Modals */}
      <CreateInvoiceModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateInvoice}
      />

      <AddPaymentModal 
        isOpen={showAddPaymentModal}
        onClose={() => {
          setShowAddPaymentModal(false);
          setSelectedBooking(null);
        }}
        onSubmit={handleAddPaymentSubmit}
        booking={selectedBooking}
      />

      <RequestPaymentModal 
        isOpen={showRequestPaymentModal}
        onClose={() => {
          setShowRequestPaymentModal(false);
          setSelectedBooking(null);
        }}
        onSuccess={handlePaymentRequestSubmit}
        booking={selectedBooking}
      />
    </div>
  );
};

export default InvoiceManagement;