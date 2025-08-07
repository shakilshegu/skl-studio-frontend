'use client'
import { useState } from 'react';
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
  RefreshCw,
  Inbox,
  TrendingUp,
  Award,
  Users
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
          color: 'text-brand-600', 
          bg: 'bg-brand-50 border-brand-200', 
          icon: AlertCircle,
          label: 'Open' 
        };
      case 'in-progress':
        return { 
          color: 'text-primary-600', 
          bg: 'bg-primary-50 border-primary-200', 
          icon: Clock,
          label: 'In Progress' 
        };
      case 'resolved':
        return { 
          color: 'text-green-600', 
          bg: 'bg-green-50 border-green-200', 
          icon: CheckCircle,
          label: 'Resolved' 
        };
      case 'closed':
        return { 
          color: 'text-gray-600', 
          bg: 'bg-gray-50 border-gray-200', 
          icon: XCircle,
          label: 'Closed' 
        };
      default:
        return { 
          color: 'text-gray-600', 
          bg: 'bg-gray-50 border-gray-200', 
          icon: AlertCircle,
          label: status || 'Unknown' 
        };
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-primary-600 bg-primary-50 border-primary-200';
      case 'high':
        return 'text-brand-accent bg-primary-50 border-primary-200';
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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

  // Calculate stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-6">
              {error.response?.data?.message || error.message || 'Failed to load tickets'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-brand-primary text-white rounded-xl hover:bg-brand-600 transition-colors flex items-center gap-2 mx-auto font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Support Tickets</h1>
            <p className="text-gray-600 text-lg">
              Track and manage all your support requests in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
              title="Refresh tickets"
            >
              <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={onCreateTicket}
              className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-600 text-white rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Create New Ticket
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-brand-50 rounded-xl">
                <Inbox className="w-8 h-8 text-brand-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Open</p>
                <p className="text-3xl font-bold text-brand-600">{stats.open}</p>
              </div>
              <div className="p-3 bg-brand-50 rounded-xl">
                <AlertCircle className="w-8 h-8 text-brand-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-primary-600">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-xl">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
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
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              
              {searchTerm && (
                <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-sm border border-brand-200">
                  Search: "{searchTerm}"
                </span>
              )}
              
              {statusFilter !== 'all' && (
                <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-sm border border-brand-200 capitalize">
                  Status: {statusFilter}
                </span>
              )}
              
              {priorityFilter !== 'all' && (
                <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-sm border border-brand-200 capitalize">
                  Priority: {priorityFilter}
                </span>
              )}
              
              {categoryFilter !== 'all' && (
                <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-sm border border-brand-200 capitalize">
                  Category: {categoryFilter}
                </span>
              )}
              
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 underline hover:no-underline transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600 text-lg">
          Showing <span className="font-semibold text-gray-900">{filteredTickets.length}</span> of <span className="font-semibold text-gray-900">{tickets.length}</span> tickets
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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
          {tickets.length === 0 ? (
            <>
              <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-brand-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No tickets yet</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                You haven't created any support tickets yet. Create your first ticket to get help with any issues.
              </p>
              <button
                onClick={onCreateTicket}
                className="px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-600 text-white rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all duration-200 flex items-center gap-2 mx-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Create Your First Ticket
              </button>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No tickets match your filters</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors font-medium"
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
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden hover:-translate-y-0.5"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                          {ticket.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusDetails.bg} ${statusDetails.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusDetails.label}
                        </span>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <span className="font-mono bg-gray-50 px-2 py-1 rounded-md">
                          {ticket.ticketId}
                        </span>
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
                      <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                        {ticket.description}
                      </p>

                      {/* Tags */}
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium capitalize border ${getPriorityColor(ticket.priority)}`}>
                          <Flag className="w-3 h-3 inline mr-1" />
                          {ticket.priority} Priority
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="ml-6 flex-shrink-0">
                      <button
                        onClick={() => onViewTicket(ticket._id)}
                        className="px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-600 text-white rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
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