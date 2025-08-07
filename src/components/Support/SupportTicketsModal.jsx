import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  Plus, 
  MessageCircle, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Calendar,
  User,
  Tag,
  Eye
} from "lucide-react";
import RaiseTicketModal from "../My-Booking/RaiseTicketModal"; 

const SupportTicketsModal = ({ 
  isOpen, 
  onClose, 
  tickets = [], 
  bookingData, 
  isLoading = false 
}) => {
  const [showRaiseTicket, setShowRaiseTicket] = useState(false);
  const router = useRouter();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewTicket = (ticketId) => {
    router.push(`/user/support/ticket/${ticketId}`);
    onClose(); // Close the modal when navigating
  };

  const handleTicketCreated = (newTicket) => {
    setShowRaiseTicket(false);
    // Optionally redirect to the new ticket
    if (newTicket && newTicket._id) {
      router.push(`/support/ticket/${newTicket._id}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0" style={{ backgroundColor: '#892580' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Support Tickets</h3>
                <p className="text-purple-100 text-sm mt-1">
                  {bookingData?.customBookingId && `Booking: ${bookingData.customBookingId}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowRaiseTicket(true)}
                  className="flex items-center gap-2 bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Ticket
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-700 mb-2">No Support Tickets</h4>
                <p className="text-gray-500 mb-6">You haven't raised any support tickets for this booking yet.</p>
                <button
                  onClick={() => setShowRaiseTicket(true)}
                  className="flex items-center gap-2 mx-auto px-6 py-3 rounded-lg font-medium text-white transition-colors"
                  style={{ backgroundColor: '#892580' }}
                >
                  <Plus className="w-4 h-4" />
                  Raise Your First Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer"
                    onClick={() => handleViewTicket(ticket._id)}
                  >
                    {/* Ticket Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {ticket.title}
                          </h4>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(ticket.status)}`}
                          >
                            {ticket.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span className="font-mono">{ticket.ticketId}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span className="capitalize">{ticket.category}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className={`font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {getStatusIcon(ticket.status)}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTicket(ticket._id);
                          }}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View ticket details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Ticket Description */}
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {ticket.description}
                    </p>

                    {/* Ticket Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Created by {ticket.createdByName}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(ticket.createdAt)}</span>
                      </div>
                    </div>

                    {/* Comments Count */}
                    {ticket.comments && ticket.comments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MessageCircle className="w-4 h-4" />
                          <span>{ticket.comments.length} comment{ticket.comments.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="text-center text-xs text-gray-500">
              Need help? Our support team typically responds within 24 hours.
            </div>
          </div>
        </div>
      </div>

      {/* Raise Ticket Modal */}
      <RaiseTicketModal
        isOpen={showRaiseTicket}
        onClose={() => setShowRaiseTicket(false)}
        booking={bookingData}
        onTicketCreated={handleTicketCreated}
      />
    </>
  );
};

export default SupportTicketsModal;