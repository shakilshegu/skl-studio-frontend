"use client";
import React, { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserBookings } from "@/services/Booking/user.bookings.service";
import { cancelBookingService } from "@/services/Booking/user.bookings.service";
import { 
  MessageSquare, 
  Calendar, 
  MapPin, 
  User, 
  ChevronDown, 
  ChevronUp,
  CreditCard,
  Receipt,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Building,
  Camera,
  Headphones,
  Bell,
  X ,
   Download, 
  Loader2   
} from "lucide-react";
import { useRouter } from "next/navigation";
import ChatDrawer from "@/components/user/Chat/ChatDrawer";
import RaiseTicketModal from "@/components/My-Booking/RaiseTicketModal";
import CustomPaymentModal from "@/components/My-Booking/CustomPaymentModal";
import ExpandedInvoiceDetails from "@/components/My-Booking/ExpandedInvoiceDetails";
import ExpandedPaymentRequests from "@/components/My-Booking/ExpandedPaymentRequests";
import moment from "moment";
import { createCustomOrderService, declineRequest, verifyCustomPaymentService,downloadInvoicePDF } from "@/services/Payment/payment.services";
import Script from "next/script";
import { showToast } from "@/components/Toast/Toast";

const UserBookings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [expandedInvoices, setExpandedInvoices] = useState({});
  const [expandedRequests, setExpandedRequests] = useState({});
  
  const [showCustomPaymentModal, setShowCustomPaymentModal] = useState(false);
  const [customPaymentBooking, setCustomPaymentBooking] = useState(null);
  
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketBooking, setTicketBooking] = useState(null);

  const [downloadingInvoices, setDownloadingInvoices] = useState({});

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userBookings"],
    queryFn: getUserBookings,
  });

  const bookings = data?.data || [];

  const filteredBookings = bookings.filter(booking => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'upcoming') return ['pending', 'confirmed'].includes(booking.status);
    if (selectedTab === 'completed') return booking.status === 'completed';
    if (selectedTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All', count: bookings.length },
    { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length },
    { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
  ];

const isCancellationAllowed = (booking) => {
  // Only allow cancellation for pending/confirmed bookings
  if (!['pending', 'confirmed'].includes(booking.status)) {
    return false;
  }

  // Get the earliest booking date
  if (!booking.bookingDates || booking.bookingDates.length === 0) {
    return false;
  }

  const earliestDate = booking.bookingDates
    .map(bd => moment(bd.date))
    .sort((a, b) => a.diff(b))[0];
  
  const now = moment();
  const hoursUntilBooking = earliestDate.diff(now, 'hours');
  
  // Allow cancellation if more than 48 hours (2 days) remain
  return hoursUntilBooking > 48;
};

const isPaymentAllowed = (booking) => {
  // Get the earliest booking date
  if (!booking.bookingDates || booking.bookingDates.length === 0) {
    return true; // Allow payment if no dates (fallback)
  }

  if(booking.status==="cancelled"||booking.status=="refunded") return false

  const earliestDate = booking.bookingDates
    .map(bd => moment(bd.date))
    .sort((a, b) => a.diff(b))[0];
  
  const now = moment();
  
  // Allow payment if booking start date has passed or is today
  return now.isSameOrAfter(earliestDate, 'day');
};

// Import the service

// Add this mutation with your other mutations
const cancelBookingMutation = useMutation({
  mutationFn: cancelBookingService,
  onSuccess: (data) => {
    showToast('Booking cancelled successfully!',"error");
    queryClient.invalidateQueries({ queryKey: ["userBookings"] });
  },
  onError: (error) => {
    console.error('Error cancelling booking:', error);
    showToast(error.message || 'Failed to cancel booking. Please try again.',"error");
  },
});

// Replace your handleCancelBooking function with this:
const handleCancelBooking = async (bookingId) => {
  const booking = bookings.find(b => b._id === bookingId);
  
  if (!booking) return;
  
  const confirmMessage = `Are you sure you want to cancel this booking?\n\nBooking: ${booking.customBookingId}\nThis action cannot be undone.`;
  
  if (window.confirm(confirmMessage)) {
    cancelBookingMutation.mutate(bookingId);
  }
};

  const toggleInvoiceExpansion = (bookingId) => {
    setExpandedInvoices(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const toggleRequestsExpansion = (bookingId) => {
    setExpandedRequests(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const handleViewDetails = useCallback((id) => {
    router.push(`/user/work-order/${id}`);
    setIsOpen(false);
  }, [router]);

  const handlePayment = (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId);
    setCustomPaymentBooking(booking);
    setShowCustomPaymentModal(true);
  };

  const handlePaymentFromRequest = async (request, bookingId) => {
    try {
      const orderResponse = await createCustomOrderService({
        amount: request.amount,
        bookingId
      });

      if (orderResponse.success) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderResponse.order.amount,
          currency: orderResponse.order.currency,
          name: 'Aloka',
          description: `Payment for request ${request.requestId}`,
          order_id: orderResponse.order.id,
          handler: function (response) {
            verifyPaymentMutation.mutate({
              bookingId: bookingId,
              customAmount: request.amount,
              transactionId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              paymentMethod: 'online',
              description: `Payment for request ${request.requestId}`,
              paymentRequestId: request.requestId
            });
          },
          prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
          },
          theme: {
            color: '#872980',
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        throw new Error('Failed to create payment order');
      }
    } catch (error) {
      console.error('Error processing payment from request:', error);
      showToast('Failed to initiate payment. Please try again.',"error");
    }
  };

  const declineMutation = useMutation({
    mutationFn: declineRequest,
    onSuccess: () => {
      showToast('Request declined successfully');
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
    },
    onError: (error) => {
      console.error('Error declining request:', error);
      showToast('Failed to decline request',"error");
    }
  });
  
  const handleDeclineRequest = (request) => {
    declineMutation.mutate(request.requestId);
  };
  
  const verifyPaymentMutation = useMutation({
    mutationFn: verifyCustomPaymentService,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
      setShowCustomPaymentModal(false);
      setCustomPaymentBooking(null);
      showToast("Payment successful! Your booking has been updated.");
    },
    onError: (error) => {
      console.error('Error verifying payment:', error);
      showToast('Payment verification failed.',"error");
    },
  });

  const openRazorpayModal = (orderData, paymentData) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Aloka',
      description: "Partial payment",
      order_id: orderData.id,
      handler: function (response) {
        verifyPaymentMutation.mutate({
          bookingId: customPaymentBooking._id,
          customAmount: paymentData.amount,
          transactionId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          paymentMethod: 'online',
          description: `Partial payment of ₹${paymentData.amount}`,
          paymentRequestId: customPaymentBooking.paymentRequestId
        });
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
      },
      theme: {
        color: '#872980',
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      const orderResponse = await createCustomOrderService({
        amount: paymentData.amount,
        bookingId: customPaymentBooking._id
      });

      if (orderResponse.success) {
        openRazorpayModal(orderResponse.order, paymentData);
      } else {
        throw new Error('Failed to create payment order');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      showToast('Failed to initiate payment. Please try again.',"error");
      throw error;
    }
  };

  const handleRaiseTicket = (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId);
    setTicketBooking(booking);
    setShowTicketModal(true);
  };

  const handleTicketSubmit = async (ticketData) => {
    try {
      showToast('Ticket submitted successfully! We will get back to you soon.');
    } catch (error) {
      console.error('Error submitting ticket:', error);
      throw error;
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentConfig = (paymentStatus) => {
    console.log("Payment Status:", paymentStatus);

    const configs = {
      refunded: { label: 'Payment refunded', color: 'text-red-600', bgColor: 'bg-red-50', icon: CreditCard },
      pending: { label: 'Payment Pending', color: 'text-red-600', bgColor: 'bg-red-50', icon: AlertCircle },
      partial: { label: 'Partially Paid', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: CreditCard },
      completed: { label: 'Fully Paid', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle },
    };
    return configs[paymentStatus] || configs.pending;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDateRange = (booking) => {
    if (!booking.bookingDates || booking.bookingDates.length === 0) return "No dates";
    
    const sortedDates = [...booking.bookingDates].sort((a, b) => moment(a.date).diff(moment(b.date)));
    const firstDate = moment(sortedDates[0].date);
    const lastDate = moment(sortedDates[sortedDates.length - 1].date);

    if (sortedDates.length === 1) {
      return firstDate.format("MMM DD, YYYY");
    }
    
    return `${firstDate.format('MMM DD')} - ${lastDate.format('MMM DD, YYYY')}`;
  };

                const handleDownloadInvoice = async (bookingId,customBookingId) => {
  if (downloadingInvoices[bookingId]) return;
  
  setDownloadingInvoices(prev => ({ ...prev, [bookingId]: true }));
  
  try {
    const result = await downloadInvoicePDF(bookingId,customBookingId);
    showToast(`Invoice downloaded successfully: ${result.filename}`, 'success');
  } catch (error) {
    console.error('Download failed:', error);
    showToast(error.message || 'Failed to download invoice. Please try again.', 'error');
  } finally {
    setDownloadingInvoices(prev => ({ ...prev, [bookingId]: false }));
  }
};


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-center">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">Failed to load bookings</p>
          <p className="text-gray-500 text-sm">{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 py-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-xs sm:text-sm text-gray-500">Manage your photography sessions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                  selectedTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      selectedTab === tab.id
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 text-sm">
              {selectedTab === 'all' 
                ? "You haven't made any bookings yet." 
                : `No ${selectedTab} bookings found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const paymentConfig = getPaymentConfig(booking?.paymentStatus);
              const StatusIcon = statusConfig.icon;
              const PaymentIcon = paymentConfig.icon;
              const canCancelBooking = isCancellationAllowed(booking);
const canShowPayButton = isPaymentAllowed(booking);
const hasPendingPayment = booking.paymentSummary?.pendingAmount > 0;

              const paymentRequests = booking.paymentRequests?.requests || [];
              const requestSummary = booking.paymentRequests?.summary || {};



// Calculate grid columns based on visible buttons
// const getGridCols = () => {
//   let buttonCount = 2; // Details and Support always visible
//   if (canCancelBooking) buttonCount++;
//   if (hasPendingPayment && canShowPayButton) buttonCount++;
//   return `grid-cols-${buttonCount}`;
// };
const getGridCols = (booking) => {
  let buttonCount = 2; // Always Details and Support

  if (canCancelBooking) buttonCount++;
  if (hasPendingPayment && canShowPayButton) buttonCount++;
  if (booking.paymentSummary?.totalInvoices > 0) buttonCount++;

  // Example: base = 1, sm = 2, md = buttonCount
  return `grid-cols-1 sm:grid-cols-2 md:grid-cols-${buttonCount}`;
};


              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-4 sm:p-6">
                    {/* Header Row */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        {/* Entity Image */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {booking?.entityDetails?.image ? (
                            <img
                              src={booking.entityDetails.image}
                              alt={booking.entityDetails.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600">
                              <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Booking Info */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                              {booking.packageId ? "Aloka Package" : booking?.entityDetails?.name}
                            </h3>
                            
                            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                              <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusConfig.color}`}>
                                <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                {statusConfig.label}
                              </span>
                              
                              <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${paymentConfig.bgColor} ${paymentConfig.color}`}>
                                <PaymentIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">{paymentConfig.label}</span>
                                <span className="sm:hidden">{paymentConfig.label.split(' ')[0]}</span>
                              </span>
                              
                              {requestSummary.hasPendingCustomerAction && (
                                <button
                                  onClick={() => toggleRequestsExpansion(booking._id)}
                                  className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
                                >
                                  <Bell className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                                  <span className="hidden sm:inline">{requestSummary.sentRequests}</span>
                                </button>
                              )}

                              {/* ✅ NEW: Cancellation status badge */}
                              {/* {cancellationInfo && cancellationInfo.canCancel && (
                                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800">
                                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">{cancellationInfo.message}</span>
                                  <span className="sm:hidden">Can Cancel</span>
                                </span>
                              )} */}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-1">
                            <Receipt className="w-3 h-3 sm:w-4 sm:h-4" />
                           
                            <span className="font-mono text-xs">{booking.customBookingId}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                            {booking.entityType === 'studio' ? (
                              <Building className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                              <User className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                            <span className="text-xs sm:text-sm">
                              {booking.packageId ? "Admin Package" : 
                               `${booking.entityType === "studio" ? "Studio" : "Freelancer"} Booking`}
                            </span>
                          </div>

                          {/* Date and Location */}
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                                  {getDateRange(booking)}
                                </div>
                                {booking.bookingDates?.length > 1 && (
                                  <div className="text-xs text-gray-500">
                                    {booking.bookingDates.length} sessions
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-md sm:rounded-lg flex items-center justify-center">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                                  {booking.packageId ? "Location TBD" : booking?.entityDetails?.location}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 w-full lg:min-w-80 lg:w-auto">
                        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900">Payment Summary</h4>
                          <div className="flex items-center gap-1 sm:gap-2">
                            {booking.paymentSummary?.totalInvoices > 0 && (
                              <button
                                onClick={() => toggleInvoiceExpansion(booking._id)}
                                className="flex items-center gap-1 text-xs sm:text-sm text-purple-600 hover:text-purple-700"
                              >
                                <Receipt className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">
                                  {booking.paymentSummary.totalInvoices} invoice{booking.paymentSummary.totalInvoices !== 1 ? 's' : ''}
                                </span>
                                <span className="sm:hidden">{booking.paymentSummary.totalInvoices}</span>
                                {expandedInvoices[booking._id] ? (
                                  <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                              </button>
                            )}
                            
                            {requestSummary.totalRequests > 0 && (
                              <button
                                onClick={() => toggleRequestsExpansion(booking._id)}
                                className="flex items-center gap-1 text-xs sm:text-sm text-orange-600 hover:text-orange-700"
                              >
                                <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">
                                  {requestSummary.totalRequests} request{requestSummary.totalRequests !== 1 ? 's' : ''}
                                </span>
                                <span className="sm:hidden">{requestSummary.totalRequests}</span>
                                {expandedRequests[booking._id] ? (
                                  <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(booking.subtotal)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">GST (18%):</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(booking.gstAmount)}
                            </span>
                          </div>
                          
                          {/* <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Platform Fee:</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(booking.platformFee)}
                            </span>
                          </div> */}
                          
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-900 text-sm sm:text-base">Total Amount:</span>
                              <span className="font-bold text-gray-900 text-sm sm:text-base">
                                {formatCurrency(booking.paymentSummary?.totalAmount || booking.totalAmount)}
                              </span>
                            </div>
                          </div>
                          
{(booking.packageId
  ? booking.totalPaid > 0
  : booking.paymentSummary?.totalPaid > 0) && (
  <div className="flex justify-between text-xs sm:text-sm">
    <span className="text-gray-600">Paid:</span>
    <span className="font-semibold text-green-600">
      {formatCurrency(
        booking.packageId
          ? booking.totalPaid
          : booking.paymentSummary.totalPaid
      )}
    </span>
  </div>
)}

{(booking.packageId
  ? booking.pendingAmount > 0
  : booking.paymentSummary?.pendingAmount > 0) && (
  <div className="flex justify-between text-xs sm:text-sm">
    <span className="text-gray-600">Remaining:</span>
    <span className="font-semibold text-orange-600">
      {formatCurrency(
        booking.packageId
          ? booking.pendingAmount
          : booking.paymentSummary.pendingAmount
      )}
    </span>
  </div>
)}

                        </div>
                      </div>
                    </div>

                    {/* Use Separated Components */}
                    {expandedRequests[booking._id] && (
                      <ExpandedPaymentRequests
                        paymentRequests={paymentRequests}
                        onPaymentFromRequest={handlePaymentFromRequest}
                        onDeclineRequest={handleDeclineRequest}
                        bookingId={booking._id}
                        formatCurrency={formatCurrency}
                      />
                    )}

                    {expandedInvoices[booking._id] && (
                      <ExpandedInvoiceDetails
                        invoices={booking.paymentSummary?.invoices}
                        onPayment={handlePayment}
                        bookingId={booking._id}
                        formatCurrency={formatCurrency}
                      />
                    )}

                    {/* ✅ UPDATED: Action Buttons with Cancel Button */}
<div className={`grid gap-2 sm:gap-3 ${getGridCols(booking)}`}>
  {/* <div className={`grid gap-2 sm:gap-3 ${getGridCols()}`}> */}
  <button
    onClick={() => handleViewDetails(booking._id)}
    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
  >
    <Eye className="w-4 h-4" />
    <span>Details</span>
  </button>
                      
                  
{hasPendingPayment && canShowPayButton && (
    <button
      onClick={() => handlePayment(booking._id)}
      className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
    >
      <CreditCard className="w-4 h-4" />
      <span>Pay</span>
    </button>
  )}

                      <button
                        onClick={() => handleRaiseTicket(booking._id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        <Headphones className="w-4 h-4" />
                        <span>Support</span>
                      </button>

                      {/* <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Chat</span>
                      </button> */}

                      {/* ✅ NEW: Cancel Button - Only show if cancellation is allowed */}
                     
   {/* ✅ NEW: Invoice Download Button - Only show if invoices exist */}
  {booking.paymentSummary?.totalInvoices > 0 && (
    <button
      onClick={() => handleDownloadInvoice(booking._id,booking?.customBookingId)}
      disabled={downloadingInvoices[booking._id]}
      className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium disabled:bg-purple-300 disabled:cursor-not-allowed"
      title="Download all invoices as PDF"
    >
      {downloadingInvoices[booking._id] ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span>
        {downloadingInvoices[booking._id] ? 'Downloading...' : 'Invoice'}
      </span>
    </button>
  )}
  
  
  {canCancelBooking && (
    <button
      onClick={() => handleCancelBooking(booking._id)}
      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
      title="Cancel booking (available up to 2 days before booking date)"
    >
      <X className="w-4 h-4" />
      <span>Cancel</span>
    </button>
  )}

    {hasPendingPayment && !canShowPayButton && (
    <div className="col-span-full mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-xs text-yellow-800 flex items-center">
        <AlertCircle className="w-3 h-3 mr-1" />
        Payment option will be available from the booking start date
      </p>
    </div>
  )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Drawer */}
      <ChatDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        booking={selectedBooking}
      />

      {/* Raise Ticket Modal */}
      <RaiseTicketModal
        isOpen={showTicketModal}
        onClose={() => {
          setShowTicketModal(false);
          setTicketBooking(null);
        }}
        booking={ticketBooking}
        onSubmit={handleTicketSubmit}
      />

      {/* Custom Payment Modal */}
      <CustomPaymentModal
        isOpen={showCustomPaymentModal}
        onClose={() => {
          setShowCustomPaymentModal(false);
          setCustomPaymentBooking(null);
        }}
        booking={customPaymentBooking}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  );
};

export default UserBookings;
