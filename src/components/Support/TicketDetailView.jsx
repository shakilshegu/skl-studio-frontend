'use client'
import { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  MessageCircle, 
  Paperclip, 
  Send,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Tag,
  Flag,
  RefreshCw,
  Shield,
  Building2,
  UserCircle2,
  Bot
} from 'lucide-react';
import { useTicket, useAddComment } from '../../hooks/useSupportQueries';

const TicketDetailView = ({ ticketId, onBack }) => {
  const [comment, setComment] = useState('');

  // TanStack Query hooks
  const { 
    data: ticket, 
    isLoading: loading, 
    error, 
    refetch 
  } = useTicket(ticketId);

  const addCommentMutation = useAddComment();

  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    addCommentMutation.mutate(
      { ticketId, message: comment.trim() },
      {
        onSuccess: () => {
          setComment('');
        },
        onError: (error) => {
          console.error('Error adding comment:', error);
          alert('Failed to add comment. Please try again.');
        }
      }
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return formatDate(dateString);
  };

  // Get status details with purple theme
  const getStatusDetails = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return { 
          color: 'text-[#892580]', 
          bg: 'bg-[#892580]', 
          icon: AlertCircle,
          label: 'Open',
        };
      case 'in-progress':
        return { 
          color: 'text-amber-600', 
          bg: 'bg-gradient-to-r from-amber-500 to-orange-500', 
          icon: Clock,
          label: 'In Progress',
        };
      case 'resolved':
        return { 
          color: 'text-emerald-600', 
          bg: 'bg-gradient-to-r from-emerald-500 to-green-500', 
          icon: CheckCircle,
          label: 'Resolved'
        };
      case 'closed':
        return { 
          color: 'text-gray-600', 
          bg: 'bg-black', 
          icon: XCircle,
          label: 'Closed'
        };
      default:
        return { 
          color: 'text-gray-600', 
          bg: 'bg-black', 
          icon: AlertCircle,
          label: status || 'Unknown'
        };
    }
  };

  // Get priority color with purple theme
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'low':
        return 'text-gray-700 bg-gray-100 border-gray-200';
      case 'medium':
        return 'text-[#892580] bg-purple-50 border-purple-200';
      case 'high':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'urgent':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  // Get user avatar and styling with purple theme
  const getUserAvatar = (authorModel, authorName) => {
    const initials = authorName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
    
    switch (authorModel?.toLowerCase()) {
      case 'employee':
        return {
          icon: Shield,
          bg: 'bg-[#892580]',
          text: 'text-white',
          border: 'border-[#892580]',
          role: 'Admin',
          roleColor: 'text-[#892580] bg-purple-50'
        };
      case 'partnerstudios':
        return {
          icon: Building2,
          bg: 'bg-black',
          text: 'text-white',
          border: 'border-black',
          role: 'Studio',
          roleColor: 'text-white bg-black'
        };
      case 'freelancer':
        return {
          icon: UserCircle2,
          bg: 'bg-gray-700',
          text: 'text-white',
          border: 'border-gray-700',
          role: 'Freelancer',
          roleColor: 'text-gray-700 bg-gray-100'
        };
      default:
        return {
          icon: User,
          bg: 'bg-gray-500',
          text: 'text-white',
          border: 'border-gray-500',
          role: 'User',
          roleColor: 'text-gray-700 bg-gray-100'
        };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#892580] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-4">
            {error.response?.data?.message || error.message || 'Failed to load ticket details'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#892580] text-white rounded-lg hover:bg-[#7a2073] transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No ticket found
  if (!ticket?.data && !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Ticket not found</p>
        </div>
      </div>
    );
  }

  const ticketData = ticket?.data || ticket;
  const statusDetails = getStatusDetails(ticketData.status);
  const StatusIcon = statusDetails.icon;
  const isSubmittingComment = addCommentMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-black">{ticketData.title}</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${statusDetails.bg} flex items-center gap-2 shadow-lg ${statusDetails.pulse || ''}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusDetails.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg">{ticketData.ticketId}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(ticketData.createdAt)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh ticket"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Ticket Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#892580] rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <p className="font-bold text-black capitalize">{ticketData.category}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <Flag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Priority</p>
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold capitalize border ${getPriorityColor(ticketData.priority)}`}>
                    {ticketData.priority}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#892580] rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Created By</p>
                  <p className="font-bold text-black">{ticketData.createdByName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#892580]" />
            Description
          </h3>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ticketData.description}</p>
          </div>
        </div>

        {/* Chat-Style Comments */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[#892580] p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Conversation</h3>
                <p className="text-purple-100 text-sm">{ticketData.comments?.length || 0} messages</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-6 max-h-96 overflow-y-auto space-y-4 bg-gray-50">
            {ticketData.comments && ticketData.comments.length > 0 ? (
              ticketData.comments.map((commentItem, index) => {
                const userInfo = getUserAvatar(commentItem.authorModel, commentItem.authorName);
                const isAdmin = commentItem.authorModel?.toLowerCase() === 'employee';
                const UserIcon = userInfo.icon;
                
                return (
                  <div key={index} className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                    
                    {/* Message Bubble */}
                    <div className={`flex-1 max-w-xs ${isAdmin ? 'ml-auto' : 'mr-auto'}`}>
                      <div className={`${isAdmin ? 'bg-[#892580] text-white' : 'bg-white border border-gray-200'} rounded-2xl p-4 shadow-md`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs ${isAdmin ? 'text-purple-100' : 'text-gray-500'}`}>
                            {formatRelativeTime(commentItem.createdAt)}
                          </span>
                        </div>
                        <p className={`font-medium text-sm mb-1 ${isAdmin ? 'text-white' : 'text-black'}`}>
                          {commentItem.authorName}
                        </p>
                        <p className={`text-sm leading-relaxed ${isAdmin ? 'text-white' : 'text-gray-700'}`}>
                          {commentItem.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No messages yet</p>
                <p className="text-gray-400 text-sm">Start the conversation!</p>
              </div>
            )}
          </div>

          {/* Chat Input */}
          {ticketData.status !== 'closed' && (
            <div className="border-t border-gray-200 bg-white p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Type your message..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#892580] focus:border-[#892580] outline-none transition-all resize-none disabled:opacity-50 disabled:bg-gray-50 text-sm"
                    disabled={isSubmittingComment}
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {comment.length}/500 characters
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                    title="Attach file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleSubmitComment}
                    disabled={isSubmittingComment || !comment.trim()}
                    className={`p-3 rounded-xl font-medium transition-all duration-200 ${
                      isSubmittingComment || !comment.trim()
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#892580] text-white hover:bg-[#7a2073] shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isSubmittingComment ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Comment Error */}
              {addCommentMutation.isError && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-800">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Failed to post comment</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    {addCommentMutation.error?.response?.data?.message || 
                     addCommentMutation.error?.message || 
                     'An error occurred while posting your comment. Please try again.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Closed Status */}
          {ticketData.status === 'closed' && (
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 font-medium">This conversation is closed</p>
                <p className="text-gray-500 text-sm">No new messages can be sent</p>
                {ticketData.resolvedAt && (
                  <p className="text-gray-400 text-xs mt-2">
                    Resolved on {formatDate(ticketData.resolvedAt)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailView;

  