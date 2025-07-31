'use client'
import  { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  MessageCircle, 
  Search, 
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Tag,
  Flag,
  RefreshCw
} from 'lucide-react';
import { useMyTickets } from '../../hooks/useSupportQueries';

const MyTicketsList = ({ onViewTicket, onCreateTicket }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // TanStack Query hook for fetching tickets
  const { 
    data: ticketsResponse, 
    isLoading: loading, 
    error, 
    refetch,
    isFetching
  } = useMyTickets();

  const tickets = ticketsResponse?.data || ticketsResponse || [];

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return formatDate(dateString);
  };

  // Get status details
  const getStatusDetails = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return { 
          color: 'text-blue-600', 
          bg: 'bg-blue-100', 
          icon: AlertCircle,
          label: 'Open' 
        };
      case 'in-progress':
        return { 
          color: 'text-yellow-600', 
          bg: 'bg-yellow-100', 
          icon: Clock,
          label: 'In Progress' 
        };
      case 'resolved':
        return { 
          color: 'text-green-600', 
          bg: 'bg-green-100', 
          icon: CheckCircle,
          label: 'Resolved' 
        };
      case 'closed':
        return { 
          color: 'text-gray-600', 
          bg: 'bg-gray-100', 
          icon: XCircle,
          label: 'Closed' 
        };
      default:
        return { 
          color: 'text-gray-600', 
          bg: 'bg-gray-100', 
          icon: AlertCircle,
          label: status || 'Unknown' 
        };
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'urgent':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Get unique values for filters
  const uniqueStatuses = [...new Set(tickets.map(t => t.status))];
  const uniquePriorities = [...new Set(tickets.map(t => t.priority))];
  const uniqueCategories = [...new Set(tickets.map(t => t.category))];

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-4">
            {error.response?.data?.message || error.message || 'Failed to load tickets'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Support Tickets</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your support requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            title="Refresh tickets"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={onCreateTicket}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Ticket
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status} className="capitalize">
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Priority</option>
              {uniquePriorities.map(priority => (
                <option key={priority} value={priority} className="capitalize">
                  {priority}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {searchTerm && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
                  Search: "{searchTerm}"
                </span>
              )}
              
              {statusFilter !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm capitalize">
                  Status: {statusFilter}
                </span>
              )}
              
              {priorityFilter !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm capitalize">
                  Priority: {priorityFilter}
                </span>
              )}
              
              {categoryFilter !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm capitalize">
                  Category: {categoryFilter}
                </span>
              )}
              
              <button
                onClick={clearAllFilters}
                className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </p>
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Updating...</span>
          </div>
        )}
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          {tickets.length === 0 ? (
            <>
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't created any support tickets yet. Create your first ticket to get help with any issues.
              </p>
              <button
                onClick={onCreateTicket}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto font-medium"
              >
                <Plus className="w-5 h-5" />
                Create Your First Ticket
              </button>
            </>
          ) : (
            <>
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets match your filters</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => {
            const statusDetails = getStatusDetails(ticket.status);
            const StatusIcon = statusDetails.icon;
            
            return (
              <div
                key={ticket._id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {ticket.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusDetails.bg} ${statusDetails.color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusDetails.label}
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="font-mono">{ticket.ticketId}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatRelativeTime(ticket.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        <span className="capitalize">{ticket.category}</span>
                      </div>
                      {ticket.comments && ticket.comments.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{ticket.comments.length} comments</span>
                        </div>
                      )}
                    </div>

                    {/* Description Preview */}
                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                      {ticket.description}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                        <Flag className="w-3 h-3 inline mr-1" />
                        {ticket.priority}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-6">
                    <button
                      onClick={() => onViewTicket(ticket._id)}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTicketsList;