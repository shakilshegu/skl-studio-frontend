import React, { useState } from 'react';
import { 
  Calendar, 
  X, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Camera, 
  Package, 
  Users, 
  IndianRupee,
  FileText,
  Star,
  AlertCircle,
  Eye,
  ArrowLeft
} from 'lucide-react';
import BookingCard from './BookingCard';
import { useBookingDetails } from '../../../hooks/useBookingQueries';

const BookingDetailsModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  selectedBookings, 
  onAddNewLead, 
  getTeamMember, 
  getStatusColor 
}) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'details'
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Fetch detailed booking data when in details mode
  const { 
    data: bookingData, 
    isLoading: detailsLoading, 
    error: detailsError 
  } = useBookingDetails(selectedBookingId, viewMode === 'details' && !!selectedBookingId);

  if (!isOpen) return null;

  const booking = bookingData?.data;

  // Get location text from entity
  const getLocationText = (entity) => {
    if (!entity) return 'N/A';
    
    // Handle location object with lat/lng
    if (entity.location && typeof entity.location === 'object') {
      if (entity.location.lat && entity.location.lng) {
        return `${entity.location.lat.toFixed(4)}, ${entity.location.lng.toFixed(4)}`;
      }
      return 'Location coordinates';
    }
    
    // Handle location as string
    if (entity.location && typeof entity.location === 'string') {
      return entity.location;
    }
    
    // Fallback to entity name
    return entity.name || 'N/A';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get detailed status color
  const getDetailedStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Handle view details click
  const handleViewDetails = (bookingId) => {
    setSelectedBookingId(bookingId);
    setViewMode('details');
  };

  // Handle back to list
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedBookingId(null);
  };

  // Handle close modal
  const handleClose = () => {
    setViewMode('list');
    setSelectedBookingId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#892580] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {viewMode === 'details' && (
                <button
                  onClick={handleBackToList}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div>
                {viewMode === 'list' ? (
                  <h3 className="text-xl font-semibold">
                    Bookings for {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
                    })}
                  </h3>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold">Booking Details</h2>
                    {booking && (
                      <p className="text-purple-200">#{booking.customBookingId}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {viewMode === 'list' ? (
            // List View - Original Modal Content
            <>
              {selectedBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600">No bookings for this date</p>
                  <button
                    onClick={onAddNewLead}
                    className="mt-4 px-4 py-2 bg-[#892580] text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add New Lead
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedBookings.map(booking => (
                    <div key={booking.id} className="relative">
                      <BookingCard
                        booking={booking}
                        getTeamMember={getTeamMember}
                        getStatusColor={getStatusColor}
                        onViewDetails={() => handleViewDetails(booking.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Details View - Detailed Booking Information
            <>
              {detailsLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#892580]"></div>
                </div>
              )}

              {detailsError && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
                    <p className="text-red-600 mb-4">Error loading booking details</p>
                    <button 
                      onClick={handleBackToList}
                      className="px-4 py-2 bg-[#892580] text-white rounded-lg hover:bg-purple-700"
                    >
                      Back to List
                    </button>
                  </div>
                </div>
              )}

              {booking && (
                <div className="space-y-6">
                  {/* Status and Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Booking Status</h3>
                        <div className="flex gap-3 flex-wrap">
                          <span className={`px-3 py-2 rounded-lg border ${getDetailedStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <span className={`px-3 py-2 rounded-lg border ${
                            booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                            booking.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            booking.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800 border-red-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }`}>
                            Payment: {booking.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Financial Summary</h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(booking.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>GST:</span>
                            <span>{formatCurrency(booking.gstAmount)}</span>
                          </div>
                          {/* <div className="flex justify-between">
                            <span>Platform Fee:</span>
                            <span>{formatCurrency(booking.platformFee)}</span>
                          </div> */}
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total Amount:</span>
                            <span>{formatCurrency(booking.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Client Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Client Information</h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                          <div className="flex items-center gap-3">
                            <User className="text-gray-500" size={20} />
                            <span>{booking.client?.name || 'N/A'}</span>
                          </div>
                          {booking.client?.phone && (
                            <div className="flex items-center gap-3">
                              <Phone className="text-gray-500" size={20} />
                              <span>{booking.client.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <Mail className="text-gray-500" size={20} />
                            <span>{booking.client?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Entity Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          {booking.entity?.type === 'studio' ? 'Studio' : 'Freelancer'} Information
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                          <div className="flex items-center gap-3">
                            <User className="text-gray-500" size={20} />
                            <span>{booking.entity?.name || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="text-gray-500" size={20} />
                            <span>{getLocationText(booking.entity)}</span>
                          </div>
                          {booking.entity?.contact && (
                            <div className="flex items-center gap-3">
                              <Phone className="text-gray-500" size={20} />
                              <span>{booking.entity.contact}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Dates */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Booking Schedule</h3>
                    <div className="space-y-3">
                      {booking.bookingDates?.map((bookingDate, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-4 flex-wrap">
                            <Calendar className="text-gray-500" size={20} />
                            <span className="font-medium">{formatDate(bookingDate.date)}</span>
                            <Clock className="text-gray-500" size={20} />
                            <span>{bookingDate.startTime} - {bookingDate.endTime}</span>
                            {bookingDate.isWholeDay && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                Whole Day
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Services */}
                  {booking.services && booking.services.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Camera size={20} />
                        Services
                      </h3>
                      <div className="space-y-2">
                        {booking.services.map((service, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                            <div>
                              <span className="font-medium">{service.name}</span>
                              <span className="text-gray-500 ml-2">x{service.count}</span>
                            </div>
                            <span className="font-medium">{formatCurrency(service.price * service.count)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Packages */}
                  {booking.packages && booking.packages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Package size={20} />
                        Packages
                      </h3>
                      <div className="space-y-2">
                        {booking.packages.map((pkg, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                            <div>
                              <span className="font-medium">{pkg.name}</span>
                              <span className="text-gray-500 ml-2">x{pkg.count}</span>
                            </div>
                            <span className="font-medium">{formatCurrency(pkg.price * pkg.count)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Equipment */}
                  {booking.equipments && booking.equipments.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Camera size={20} />
                        Equipment
                      </h3>
                      <div className="space-y-2">
                        {booking.equipments.map((equipment, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                            <div>
                              <span className="font-medium">{equipment.name}</span>
                              <span className="text-gray-500 ml-2">x{equipment.count}</span>
                            </div>
                            <span className="font-medium">{formatCurrency(equipment.price * equipment.count)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Helpers */}
                  {booking.helpers && booking.helpers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Users size={20} />
                        Helpers
                      </h3>
                      <div className="space-y-2">
                        {booking.helpers.map((helper, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                            <div>
                              <span className="font-medium">{helper.name}</span>
                              <span className="text-gray-500 ml-2">x{helper.count}</span>
                            </div>
                            <span className="font-medium">{formatCurrency(helper.price * helper.count)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cancellation and Refund Information */}
                  {(booking.status === 'cancelled' && (booking.cancelledBy || booking.refundSummary)) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3 text-red-800">Cancellation Details</h3>
                      <div className="space-y-3">
                        {booking.cancelledBy && (
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">Cancelled by:</span> {booking.cancelledBy.name} ({booking.cancelledBy.userType})
                            </p>
                            {booking.cancellationReason && (
                              <p className="text-sm">
                                <span className="font-medium">Reason:</span> {booking.cancellationReason}
                              </p>
                            )}
                            {booking.cancelledAt && (
                              <p className="text-sm">
                                <span className="font-medium">Cancelled on:</span> {formatDate(booking.cancelledAt)}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {booking.refundSummary && booking.refundSummary.refundAmount > 0 && (
                          <div className="border-t border-red-200 pt-3">
                            <h4 className="font-medium text-red-800 mb-2">Refund Information</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Refund Amount:</span> {formatCurrency(booking.refundSummary.refundAmount)}
                              </div>
                              <div>
                                <span className="font-medium">Refund Status:</span> 
                                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                  booking.refundSummary.refundStatus === 'success' ? 'bg-green-100 text-green-800' :
                                  booking.refundSummary.refundStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {booking.refundSummary.refundStatus}
                                </span>
                              </div>
                              {booking.refundSummary.refundId && (
                                <div className="col-span-2">
                                  <span className="font-medium">Refund ID:</span> {booking.refundSummary.refundId}
                                </div>
                              )}
                              {booking.refundSummary.refundProcessedAt && (
                                <div className="col-span-2">
                                  <span className="font-medium">Processed on:</span> {formatDate(booking.refundSummary.refundProcessedAt)}
                                </div>
                              )}
                              {booking.refundSummary.refundReason && (
                                <div className="col-span-2">
                                  <span className="font-medium">Refund Reason:</span> {booking.refundSummary.refundReason}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {booking.notes && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FileText size={20} />
                        Notes
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{booking.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Rating and Feedback */}
                  {(booking.rating || booking.feedback) && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Star size={20} />
                        Feedback
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        {booking.rating && (
                          <div className="flex items-center gap-2">
                            <span>Rating:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < booking.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                            <span className="text-gray-600">({booking.rating}/5)</span>
                          </div>
                        )}
                        {booking.feedback && (
                          <div>
                            <p className="text-gray-700">{booking.feedback}</p>
                            {booking.feedbackDate && (
                              <p className="text-sm text-gray-500 mt-2">
                                Submitted on {formatDate(booking.feedbackDate)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Created:</span> {formatDate(booking.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span> {formatDate(booking.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;