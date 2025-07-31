"use client";
import React, { useState } from 'react';
import { 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Clock,
  HelpCircle,
  User,
  Calendar,
  Tag,
  Flag,
  Send,
  Paperclip,
  MoreVertical,
  Edit3,
  Trash2,
  Copy,
  Download,
  X,
  Upload
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useTicket, useAddComment } from '../../../../hooks/useSupportQueries';

const PartnerTicketDetailView = () => {
  const router = useRouter();
  const params = useParams();
  const ticketId = params?.id;

  const [newComment, setNewComment] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // API Hooks
  const { data: ticketData, isLoading, error } = useTicket(ticketId);
  const addCommentMutation = useAddComment();

  const ticket = ticketData?.data;

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'open': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'closed': return <X className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addCommentMutation.mutateAsync({
        ticketId: ticket._id,
        message: newComment.trim()
      });
      setNewComment('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleFileAttachment = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      return file.size <= maxSize && allowedTypes.includes(file.type);
    });
    
    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Please ensure files are under 5MB and are of supported formats.');
    }
    
    setAttachments(prev => [...prev, ...validFiles]);
    event.target.value = '';
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyTicketLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Ticket link copied to clipboard!');
    });
    setShowActions(false);
  };

  const downloadConversation = () => {
    // Implementation for downloading conversation
    alert('Download feature will be implemented');
    setShowActions(false);
  };

  if (isLoading) {
    return (
      <div className="mx-auto space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Ticket</h3>
          <p className="text-gray-600 mb-4">Unable to load ticket details. Please try again.</p>
          <button
            onClick={() => router.back()}
            className="bg-[#892580] text-white px-4 py-2 rounded-lg hover:bg-[#a12d8a] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="mx-auto space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ticket Not Found</h3>
          <p className="text-gray-600 mb-4">The requested ticket could not be found.</p>
          <button
            onClick={() => router.back()}
            className="bg-[#892580] text-white px-4 py-2 rounded-lg hover:bg-[#a12d8a] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-lg font-bold text-gray-900">#{ticket.ticketId}</h1>
              <span className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center space-x-1 ${getStatusColor(ticket.status)}`}>
                {getStatusIcon(ticket.status)}
                <span className="capitalize">{ticket.status.replace('-', ' ')}</span>
              </span>
              <span className={`px-2 py-1 rounded-md text-xs font-medium border capitalize ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <h2 className="text-sm text-gray-900 font-medium">{ticket.title}</h2>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button 
                  onClick={copyTicketLink}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Link</span>
                </button>
                <button 
                  onClick={downloadConversation}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Download className="w-3 h-3" />
                  <span>Export Conversation</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Ticket Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <div>
              <p className="text-gray-500">Created</p>
              <p className="font-medium text-gray-900">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-gray-400" />
            <div>
              <p className="text-gray-500">Updated</p>
              <p className="font-medium text-gray-900">
                {new Date(ticket.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Tag className="w-3 h-3 text-gray-400" />
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium text-gray-900 capitalize">{ticket.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-3 h-3 text-gray-400" />
            <div>
              <p className="text-gray-500">Assigned</p>
              <p className="font-medium text-gray-900">
                {ticket.assignedTo?.name || 'Support Team'}
              </p>
            </div>
          </div>
        </div>

        {/* Original Description */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Original Request</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{ticket.description}</p>
        </div>
      </div>

      {/* Attachments */}
      {ticket.attachments && ticket.attachments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Attachments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ticket.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#892580] transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Paperclip className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{attachment.originalName}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
                </div>
                <a
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#892580] hover:text-[#a12d8a] transition-colors"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversation */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Conversation</h3>
        </div>
        
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {ticket.comments && ticket.comments.length > 0 ? (
            ticket.comments.map((comment) => {
              const isUser = comment.authorModel === 'User' || comment.authorModel === 'PartnerStudios' || comment.authorModel === 'Freelancer';
              return (
                <div key={comment._id} className={`flex space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                    isUser 
                      ? 'bg-[#892580]' 
                      : 'bg-blue-500'
                  }`}>
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Comment Content */}
                  <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
                    <div className={`inline-block max-w-xs md:max-w-md lg:max-w-lg ${
                      isUser 
                        ? 'bg-[#892580] text-white rounded-l-xl rounded-tr-xl' 
                        : 'bg-gray-100 text-gray-900 rounded-r-xl rounded-tl-xl'
                    } p-3`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${isUser ? 'text-white/90' : 'text-gray-600'}`}>
                          {comment.authorName}
                        </span>
                        <span className={`text-xs ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
                          {formatTimestamp(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{comment.message}</p>
                    </div>
                    
                    <div className={`mt-1 text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {comment.authorModel === 'User' ? 'Customer' : 
                         comment.authorModel === 'PartnerStudios' ? 'Studio Partner' :
                         comment.authorModel === 'Freelancer' ? 'Freelancer' : 'Support Agent'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No comments yet. Start the conversation below.</p>
            </div>
          )}
        </div>

        {/* Add Comment */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-[#892580] rounded-full flex items-center justify-center text-white text-xs font-medium">
              {ticket.createdByName?.charAt(0).toUpperCase() || 'P'}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] text-sm resize-none"
                rows="3"
                disabled={addCommentMutation.isPending}
              />
              
              {/* File Attachments */}
              {attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-xs">
                      <div className="flex items-center space-x-2">
                        <Paperclip className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-700 truncate">{file.name}</span>
                        <span className="text-gray-500">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.txt,.doc,.docx"
                    onChange={handleFileAttachment}
                    className="hidden"
                    id="comment-file-upload"
                    disabled={addCommentMutation.isPending}
                  />
                  <label
                    htmlFor="comment-file-upload"
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>Attach files</span>
                  </label>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setNewComment('');
                      setAttachments([]);
                    }}
                    disabled={addCommentMutation.isPending}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || addCommentMutation.isPending}
                    className="px-3 py-1.5 bg-[#892580] text-white rounded-md text-xs hover:bg-[#a12d8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    {addCommentMutation.isPending ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerTicketDetailView;