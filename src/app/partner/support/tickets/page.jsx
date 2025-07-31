"use client";
import React, { useState } from 'react';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  HelpCircle,
  Calendar,
  Tag,
  Flag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMyTickets } from '../../../../hooks/useSupportQueries';
import RaiseTicketModal from '../../../../components/My-Booking/RaiseTicketModal';

const PartnerTicketsList = () => {
  const router = useRouter();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // API Hook
  const { data: ticketsData, isLoading, error } = useMyTickets({
    ...filters,
    page: currentPage,
    limit: 10
  });

  const tickets = ticketsData?.data || [];
  const pagination = ticketsData?.pagination || {};

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'technical', label: 'Technical' },
    { value: 'billing', label: 'Billing' },
    { value: 'booking', label: 'Booking' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-3 h-3" />;
      case 'in-progress': return <Clock className="w-3 h-3" />;
      case 'open': return <AlertCircle className="w-3 h-3" />;
      case 'closed': return <X className="w-3 h-3" />;
      default: return <HelpCircle className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-blue-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const handleTicketClick = (ticketId) => {
    router.push(`/partner/support/${ticketId}`);
  };

  const handleTicketCreated = () => {
    // Query will automatically refetch due to invalidation
    setShowTicketModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-sm text-gray-600">
              {isLoading ? 'Loading...' : `${pagination.total || 0} total tickets`}
            </p>
          </div>
          <button
            onClick={() => setShowTicketModal(true)}
            className="bg-[#892580] text-white px-4 py-2 rounded-lg hover:bg-[#a12d8a] transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets by title or ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] text-sm"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-[#892580] text-white text-xs px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#892580] hover:text-[#a12d8a] transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] text-sm"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] text-sm"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl shadow-sm">
        {isLoading ? (
          <div className="p-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Tickets</h3>
            <p className="text-gray-600">Unable to load your tickets. Please try again.</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {hasActiveFilters ? 'No tickets found' : 'No tickets yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your filters or search terms.'
                : 'Create your first support ticket to get started.'
              }
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => setShowTicketModal(true)}
                className="bg-[#892580] text-white px-4 py-2 rounded-lg hover:bg-[#a12d8a] transition-colors"
              >
                Create First Ticket
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-600 uppercase tracking-wide">
              <div className="col-span-2">Ticket ID</div>
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <div 
                  key={ticket._id}
                  onClick={() => handleTicketClick(ticket._id)}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  {/* Ticket ID */}
                  <div className="col-span-2">
                    <span className="text-sm font-mono text-gray-900">
                      {ticket.ticketId}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="col-span-4">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#892580] transition-colors">
                      {ticket.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <Tag className="w-3 h-3 mr-1" />
                        {ticket.category}
                      </span>
                      {ticket.comments && ticket.comments.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {ticket.comments.length} comments
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1 capitalize">{ticket.status.replace('-', ' ')}</span>
                    </span>
                  </div>

                  {/* Priority */}
                  <div className="col-span-1">
                    <span className={`inline-flex items-center text-xs font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                      <Flag className="w-3 h-3 mr-1" />
                      {ticket.priority}
                    </span>
                  </div>

                  {/* Created Date */}
                  <div className="col-span-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(ticket.createdAt)}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(ticket.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTicketClick(ticket._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[#892580] hover:text-[#a12d8a] p-1 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} tickets
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={pagination.page === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${
                        pageNum === pagination.page
                          ? 'bg-[#892580] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                disabled={pagination.page === pagination.pages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Raise Ticket Modal */}
      <RaiseTicketModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        booking={null} // No booking context for partners
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
};

export default PartnerTicketsList;