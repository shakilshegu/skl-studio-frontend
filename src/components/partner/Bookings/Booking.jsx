"use client";
import React, { useState, Fragment, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { ChevronDown, ChevronUp, Calendar, Clock, User, UserPlus, Eye, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { getMyBookings, updateBookingStatus, assignWorkOrder, requestCancellation } from "@/services/Booking/partner.bookings.service";
import { fetchTeamMembers } from "@/services/TeamMembers/teamMember.service";
import { showConfirm } from "@/components/Toast/Confirmation"; 
import { showToast } from "@/components/Toast/Toast";
import Select from 'react-select';

const BookingList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState({});
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Cleanup effect
  useEffect(() => {
    return () => {
      setShowAssignModal(false);
      setSelectedBooking(null);
    };
  }, []);

  // Fetch bookings for authenticated entity with proper config
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myBookings", statusFilter],
    queryFn: () => getMyBookings(),
    select:(data)=>data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
console.log(data,"----------------------------");

  // Fetch team members data with proper config
  const { data: teamMembersData = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
  });

  const teamMembers = teamMembersData?.data || [];

  // Memoized mutation success handler
  const handleMutationSuccess = useCallback(() => {
    queryClient.invalidateQueries(["myBookings"]);
  }, [queryClient]);

  // Memoized mutation error handler
  const handleMutationError = useCallback((error, operation) => {
    console.error(`Error ${operation}:`, error);
  }, []);

  // Mutation for updating booking status
  const updateStatusMutation = useMutation({
    mutationFn: ({ bookingId, status, notes }) => updateBookingStatus(bookingId, status, notes),
    onSuccess: handleMutationSuccess,
    onError: (error) => handleMutationError(error, 'updating status')
  });

  // Mutation for assigning work order
  const assignWorkMutation = useMutation({
    mutationFn: ({ bookingId, assignedTo, notes }) => assignWorkOrder(bookingId, assignedTo, notes),
    onSuccess: () => {
       queryClient.invalidateQueries(["myBookings"]);
    queryClient.invalidateQueries(["myBookings", statusFilter]);
      setTimeout(() => {
        setShowAssignModal(false);
        setSelectedBooking(null);
      }, 100);
    },
    onError: (error) => {
      handleMutationError(error, 'assigning work');
      setTimeout(() => {
        setShowAssignModal(false);
        setSelectedBooking(null);
      }, 100);
    }
  });

  // Mutation for requesting cancellation
  const requestCancelMutation = useMutation({
    mutationFn: ({ bookingId }) => requestCancellation(bookingId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["myBookings"]);
      console.log('Cancellation request sent successfully:', data);
      showToast('Cancellation request sent to admin successfully!', 'success');
    },
    onError: (error) => {
      handleMutationError(error, 'requesting cancellation');
      showToast(`Error requesting cancellation: ${error.message}`, "error");
    }
  });

  const bookings = data || [];

  // Memoized filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings?.filter(booking => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.assignedTo?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        booking.status === statusFilter ||
        (statusFilter === 'partner-cancel-requested' && booking.partnerCancelStatus === 'requested') ||
        (statusFilter === 'partner-cancelled' && booking.partnerCancelStatus === 'cancelled');

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  // Memoized pagination
  const { totalPages, currentBookings } = useMemo(() => {
    const total = Math.ceil(filteredBookings.length / itemsPerPage);
    const current = filteredBookings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    return { totalPages: total, currentBookings: current };
  }, [filteredBookings, currentPage, itemsPerPage]);

  // Stable callback functions
  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const toggleRowExpansion = useCallback((bookingId) => {
    setExpandedRows(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  }, []);

  const handleStatusChange = useCallback((bookingId, status) => {
    updateStatusMutation.mutate({
      bookingId,
      status,
      notes: `Status updated to ${status}`
    });
  }, [updateStatusMutation]);

  const handleAssignWork = useCallback((booking) => {
    if (showAssignModal) return; // Prevent multiple opens
    setSelectedBooking(booking);
    setShowAssignModal(true);
  }, [showAssignModal]);

  // Updated handle cancellation request with confirmation dialog
  const handleRequestCancellation = useCallback(async (bookingId) => {
    try {
      // Show confirmation dialog
      const confirmed = await showConfirm(
        'Are you sure you want to request cancellation for this booking? This action will notify the admin and cannot be undone.',
        'red' // Red color for destructive action
      );
      
      if (confirmed) {
        requestCancelMutation.mutate({ bookingId });
      }
    } catch (error) {
      console.error('Error in confirmation dialog:', error);
    }
  }, [requestCancelMutation]);

  const handleCloseModal = useCallback(() => {
    setShowAssignModal(false);
    setTimeout(() => {
      setSelectedBooking(null);
    }, 150);
  }, []);

  const handleAssignSubmit = useCallback((assignedTo, notes) => {
    if (!selectedBooking) return;
        
    let selectedIds = assignedTo?.map((members) => members?.value);

    assignWorkMutation.mutate({
      bookingId: selectedBooking._id,
      assignedTo: selectedIds,
      notes
    });
  }, [selectedBooking, assignWorkMutation]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  const handleItemsPerPageChange = useCallback((e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  // Memoized display functions
  const getPrimaryDateDisplay = useCallback((bookingDates) => {
    if (!bookingDates || bookingDates.length === 0) return "No dates";
    
    const sortedDates = [...bookingDates].sort((a, b) => moment(a.date).diff(moment(b.date)));
    const firstDate = sortedDates[0];
    
    const dateStr = moment(firstDate.date).format("DD/MM/YY");
    const timeStr = firstDate.isWholeDay 
      ? "All Day" 
      : `${moment().hour(firstDate.startTime).format('h A')}-${moment().hour(firstDate.endTime).format('h A')}`;
    
    return `${dateStr} ${timeStr}`;
  }, []);

  const getTotalDuration = useCallback((bookingDates) => {
    if (!bookingDates || bookingDates.length === 0) return "0 hrs";
    
    const totalHours = bookingDates.reduce((total, date) => {
      return total + (date.isWholeDay ? 12 : (date.endTime - date.startTime));
    }, 0);
    
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }, []);

  const getStatusDisplay = useCallback((booking) => {
    const { status, partnerCancelStatus } = booking;
    
    // Show partner cancel status if requested
    if (partnerCancelStatus === 'requested') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-xs shadow-sm bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <span>⚠️</span>
          Cancel Requested
        </span>
      );
    }
    
    if (partnerCancelStatus === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-xs shadow-sm bg-gradient-to-r from-red-500 to-red-600 text-white">
          <span>❌</span>
          Partner Cancelled
        </span>
      );
    }
    
    const statusConfig = {
      "pending": { bg: "bg-gradient-to-r from-yellow-400 to-yellow-500", text: "text-white", label: "Pending", icon: "⏳" },
      "confirmed": { bg: "bg-gradient-to-r from-blue-500 to-blue-600", text: "text-white", label: "Confirmed", icon: "✓" },
      "in-progress": { bg: "bg-gradient-to-r from-purple-600 to-[#892580]", text: "text-white", label: "Ongoing", icon: "🔄" },
      "completed": { bg: "bg-gradient-to-r from-green-500 to-emerald-600", text: "text-white", label: "Completed", icon: "✅" },
      "cancelled": { bg: "bg-gradient-to-r from-red-500 to-red-600", text: "text-white", label: "Cancelled", icon: "❌" },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-xs shadow-sm ${config.bg} ${config.text}`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  }, []);

  const getAssignedToDisplay = useCallback((assignedTo) => {
    if (!assignedTo || assignedTo.length === 0) {
      return (
        <div className="flex items-center gap-2 text-gray-400">
          <User size={16} />
          <span className="text-sm italic">Not Assigned</span>
        </div>
      );
    }

    return (
      <select className="px-2 py-1 rounded text-sm bg-white">
        {assignedTo.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name} ({member.role || 'Team Member'})
          </option>
        ))}
      </select>
    );
  }, []);

  // Memoized pagination buttons
  const paginationButtons = useMemo(() => {
    return Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
      const pageNumber = currentPage <= 3 ? index + 1 : currentPage - 2 + index;
      if (pageNumber > totalPages) return null;
      
      return (
        <button
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          className={`px-4 py-2 border rounded-lg transition-colors ${
            currentPage === pageNumber 
              ? "bg-[#892580] text-white border-[#892580]" 
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
        >
          {pageNumber}
        </button>
      );
    });
  }, [currentPage, totalPages, handlePageChange]);

  if (isLoading) {
    return (
      <div className="p-6 w-full border rounded-lg bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#892580]"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 w-full border rounded-lg bg-white">
        <div className="text-center text-red-500 py-8">
          <div className="text-lg font-semibold mb-2">Error loading bookings</div>
          <div>{error?.message || 'Unknown error occurred'}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 w-full bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div></div>

          <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <input
                type="text"
                placeholder="Search bookings, customers, or assignees..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full lg:w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#892580] focus:border-transparent transition-all duration-200"
              />
              <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#892580] focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="partner-cancel-requested">Partner Cancel Requested</option>
              <option value="partner-cancelled">Partner Cancelled</option>
            </select>
            
            <button className="flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-lg font-medium">No Bookings found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentBookings.map((booking) => (
                    <Fragment key={booking._id}>
                      <BookingRow
                        booking={booking}
                        expandedRows={expandedRows}
                        onToggleExpansion={toggleRowExpansion}
                        onStatusChange={handleStatusChange}
                        onAssignWork={handleAssignWork}
                        onRequestCancellation={handleRequestCancellation}
                        getPrimaryDateDisplay={getPrimaryDateDisplay}
                        getTotalDuration={getTotalDuration}
                        getStatusDisplay={getStatusDisplay}
                        getAssignedToDisplay={getAssignedToDisplay}
                        isRequestingCancel={requestCancelMutation.isPending}
                      />
                      
                      {/* Expandable row for multiple dates */}
                      {expandedRows[booking._id] && booking.bookingDates?.length > 1 && (
                        <ExpandedBookingRow
                          booking={booking}
                          getTotalDuration={getTotalDuration}
                        />
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <select 
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={30}>30 per page</option>
          </select>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {paginationButtons}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Assignment Modal - Only render when needed */}
      {showAssignModal && selectedBooking && (
        <AssignWorkModal
          key={`modal-${selectedBooking._id}-${Date.now()}`}
          booking={selectedBooking}
          teamMembers={teamMembers}
          onClose={handleCloseModal}
          onAssign={handleAssignSubmit}
          isLoading={assignWorkMutation.isPending}
        />
      )}
    </>
  );
};

// Updated BookingRow component
const BookingRow = React.memo(({ 
  booking, 
  expandedRows, 
  onToggleExpansion, 
  onStatusChange, 
  onAssignWork,
  onRequestCancellation,
  getPrimaryDateDisplay,
  getTotalDuration,
  getStatusDisplay,
  getAssignedToDisplay,
  isRequestingCancel
}) => {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors duration-150">
      <td className="px-6 py-4">
        <div className="font-mono text-sm font-medium text-[#892580]">
          #{booking.customBookingId}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium text-gray-900">{booking.userDetails?.name || "N/A"}</div>
            <div className="text-sm text-gray-500">{booking.userDetails?.mobile || "N/A"}</div>
            <div className="text-xs text-gray-400">{booking.userDetails?.email}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Calendar className="w-4 h-4 text-gray-400" />
              {getPrimaryDateDisplay(booking.bookingDates)}
            </div>
            {booking.bookingDates?.length > 1 && (
              <div className="text-xs text-gray-500 mt-1">
                +{booking.bookingDates.length - 1} more session{booking.bookingDates.length > 2 ? 's' : ''}
              </div>
            )}
          </div>
          {booking.bookingDates?.length > 1 && (
            <button
              onClick={() => onToggleExpansion(booking._id)}
              className="ml-2 text-[#892580] hover:bg-purple-50 p-1 rounded-full transition-colors"
            >
              {expandedRows[booking._id] ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-1 text-sm font-medium">
          <Clock className="w-4 h-4 text-gray-400" />
          {getTotalDuration(booking.bookingDates)}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div>
          <div className="font-semibold text-gray-900">₹ {booking.totalAmount?.toLocaleString()}</div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        {getAssignedToDisplay(booking.assignedTo)}
      </td>
      
      <td className="px-6 py-4">
        {getStatusDisplay(booking)}
      </td>
      
      <td className="px-6 py-4">
        <CustomActionMenu 
          booking={booking}
          onStatusChange={onStatusChange}
          onAssignWork={onAssignWork}
          onRequestCancellation={onRequestCancellation}
          isRequestingCancel={isRequestingCancel}
        />
      </td>
    </tr>
  );
});

BookingRow.displayName = 'BookingRow';

// Separate ExpandedBookingRow component
const ExpandedBookingRow = React.memo(({ booking, getTotalDuration }) => {
  return (
    <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
      <td colSpan="8" className="px-6 py-4">
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            All Scheduled Sessions ({booking.bookingDates.length} total):
          </div>
          
          <div className="grid gap-3">
            {booking.bookingDates
              .sort((a, b) => moment(a.date).diff(moment(b.date)))
              .map((date, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-[#892580] to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {moment(date.date).format('dddd, DD MMM YYYY')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1.5 rounded-full">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>
                        {date.isWholeDay 
                          ? "All Day (12 hours)" 
                          : `${moment().hour(date.startTime).format('h:mm A')} - ${moment().hour(date.endTime).format('h:mm A')} (${date.endTime - date.startTime}h)`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">
              <strong>Total Duration:</strong> {getTotalDuration(booking.bookingDates)} across {booking.bookingDates.length} session{booking.bookingDates.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
});

ExpandedBookingRow.displayName = 'ExpandedBookingRow';

const CustomActionMenu = React.memo(({ booking, onStatusChange, onAssignWork, onRequestCancellation, isRequestingCancel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Stable callback functions
  const handleStatusChange = useCallback((status) => {
    onStatusChange(booking._id, status);
    setIsOpen(false);
  }, [booking._id, onStatusChange]);

  const handleAssignWork = useCallback(() => {
    onAssignWork(booking);
    setIsOpen(false);
  }, [booking, onAssignWork]);

  const handleViewDetails = useCallback((id) => {
    router.push(`/partner/work-order/${id}`);
    setIsOpen(false);
  }, [router]);

  // Handle request cancellation
  const handleRequestCancellation = useCallback(() => {
    onRequestCancellation(booking._id);
    setIsOpen(false);
  }, [booking._id, onRequestCancellation]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Check if cancellation can be requested with 2-day rule
  const canRequestCancellation = useMemo(() => {
    // Basic status checks
    if (booking.partnerCancelStatus !== 'not-requested' || 
        booking.status === 'cancelled' || 
        booking.status === 'completed') {
      return { allowed: false, reason: 'Status not eligible' };
    }

    // Check if there are booking dates
    if (!booking.bookingDates || booking.bookingDates.length === 0) {
      return { allowed: false, reason: 'No booking dates found' };
    }

    // Find the earliest booking date
    const sortedDates = [...booking.bookingDates].sort((a, b) => moment(a.date).diff(moment(b.date)));
    const firstBookingDate = moment(sortedDates[0].date).startOf('day');
    const currentDate = moment().startOf('day');

    // Calculate days difference
    const daysDifference = firstBookingDate.diff(currentDate, 'days');

    // Handle different scenarios
    if (daysDifference < 0) {
      // Booking date is in the past
      const pastDays = Math.abs(daysDifference);
      return { 
        allowed: false, 
        reason: `Booking date was ${pastDays} day(s) ago. Cannot cancel past bookings.` 
      };
    } else if (daysDifference < 2) {
      // Less than 2 days remaining
      const timeRemaining = daysDifference === 0 ? 'today' : `${daysDifference} day(s)`;
      return { 
        allowed: false, 
        reason: `Booking is ${timeRemaining}. Cancellation must be requested at least 2 days before the booking date.` 
      };
    }

    return { allowed: true, reason: null };
  }, [booking.partnerCancelStatus, booking.status, booking.bookingDates]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <BiDotsVerticalRounded className="text-xl text-gray-600" />
      </button>
      
      {(isOpen && booking.status !== "cancelled") && (
        <div className="absolute right-0 w-48 bg-white shadow-lg border border-gray-200 rounded-lg py-1 z-10">
          <button
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#892580] hover:text-white transition-colors"
            onClick={() => handleViewDetails(booking._id)}
          >
            <Eye size={16} />
            View Details
          </button>
          
          <button
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            onClick={handleAssignWork}
          >
            <UserPlus size={16} />
            Assign Work
          </button>
          
          {/* Request Cancel Button with 2-day rule and confirmation */}
          <div>
            <button
              className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm transition-colors ${
                !canRequestCancellation.allowed || isRequestingCancel
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
              onClick={canRequestCancellation.allowed ? handleRequestCancellation : undefined}
              disabled={!canRequestCancellation.allowed || isRequestingCancel}
              title={!canRequestCancellation.allowed ? canRequestCancellation.reason : 'Request cancellation'}
            >
              <XCircle size={16} />
              {isRequestingCancel ? 'Requesting...' : 'Request Cancel'}
            </button>
            
            {/* Show tooltip/message when cancellation is not allowed due to time constraint */}
            {!canRequestCancellation.allowed && canRequestCancellation.reason.includes('day(s)') && (
              <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-100">
                <div className="flex items-start gap-1">
                  <span className="text-red-500">⚠️</span>
                  <span>{canRequestCancellation.reason}</span>
                </div>
              </div>
            )}
          </div>
          
          {booking.status !== 'completed' && 
           booking.status !== 'cancelled' && 
           booking.partnerCancelStatus !== 'requested' && 
           booking.partnerCancelStatus !== 'cancelled' && (
            <>
              {booking.status === 'pending' && (
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  onClick={() => handleStatusChange('confirmed')}
                >
                  ✓ Confirm
                </button>
              )}
              
              {booking.status === 'in-progress' && (
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  onClick={() => handleStatusChange('completed')}
                >
                  ✅ Complete
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
});

CustomActionMenu.displayName = 'CustomActionMenu';

const AssignWorkModal = React.memo(({ booking, teamMembers, onClose, onAssign, isLoading }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notes, setNotes] = useState('');
  const modalRef = useRef(null);

  // Escape key & outside click handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, isLoading]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (selectedUsers.length === 0 || isLoading) return;

    onAssign(selectedUsers, notes);
  }, [selectedUsers, notes, onAssign, isLoading]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [onClose, isLoading]);

  const handleChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
  };

  const handleNotesChange = useCallback((e) => {
    setNotes(e.target.value);
  }, []);

  if (!booking) return null;

  // react-select options
  const teamOptions = teamMembers.map(member => ({
    value: member._id || member.id,
    label: `${member.name} - ${member.role}`
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Assign Work Order</h3>
          <p className="text-sm text-gray-600 mt-1">#{booking?.bookingId}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Team Member(s)
            </label>
            {!teamMembers || teamMembers.length === 0 ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                No team members available
              </div>
            ) : (
              <Select
                isMulti
                isDisabled={isLoading}
                options={teamOptions}
                value={selectedUsers}
                onChange={handleChange}
                placeholder="Select team member(s)..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              disabled={isLoading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent disabled:opacity-50"
              placeholder="Add any special instructions..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedUsers?.length === 0 || isLoading}
              className="flex-1 px-4 py-2 bg-[#892580] text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Assigning...' : 'Assign Work'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

AssignWorkModal.displayName = 'AssignWorkModal';

export default BookingList;