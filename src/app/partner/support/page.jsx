"use client";
import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  FileText, 
  Search,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Clock,
  Send,
  X,
  Eye,
  Plus
} from 'lucide-react';
import { useRouter } from "next/navigation";
import { useMyTickets, useCreateTicket } from '../../../hooks/useSupportQueries';
import RaiseTicketModal from '../../../components/My-Booking/RaiseTicketModal';

const PartnerSupportPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const router = useRouter();

  // API Hooks
  const { data: ticketsData, isLoading: ticketsLoading, error: ticketsError } = useMyTickets();
  const createTicketMutation = useCreateTicket();

  // FAQ Data - Partner specific
  const faqCategories = {
    general: [
      {
        question: "How do I update my business profile?",
        answer: "Go to Profile > Business Details and click on the edit button. You can update your business information, services, and contact details there."
      },
      {
        question: "How do I manage my availability?",
        answer: "Navigate to the Availability section in your dashboard. You can set your working hours, block dates, and manage your calendar from there."
      },
      {
        question: "Can I change my service pricing?",
        answer: "Yes, you can update your service pricing anytime from the Business Details section. Changes will apply to new bookings only."
      }
    ],
    payments: [
      {
        question: "How do I receive payments from clients?",
        answer: "Payments are processed through our secure payment gateway. You can track all payments in the Invoice Management section."
      },
      {
        question: "When will I receive my payments?",
        answer: "Payments are typically processed within 2-3 business days after the service completion and client confirmation."
      },
      {
        question: "How do I add payment records?",
        answer: "In Invoice Management, find the specific lead and click 'Add Payment' to record received payments with transaction details."
      }
    ],
    bookings: [
      {
        question: "How do I accept or decline booking requests?",
        answer: "You'll receive notifications for new booking requests. You can accept or decline them from your Dashboard or Bookings section."
      },
      {
        question: "Can I reschedule a booking?",
        answer: "Yes, you can propose a reschedule through the booking details page. The client will need to confirm the new date and time."
      },
      {
        question: "What happens if a client cancels?",
        answer: "Cancellation policies depend on your terms. You can set cancellation rules in your business settings."
      }
    ],
    technical: [
      {
        question: "I'm having trouble uploading photos to my portfolio",
        answer: "Ensure your images are in JPG, PNG, or WebP format and under 5MB each. Try refreshing the page and uploading again."
      },
      {
        question: "The app is running slowly, what should I do?",
        answer: "Try clearing your browser cache, ensure you have a stable internet connection, and close unnecessary browser tabs."
      },
      {
        question: "I can't receive notifications",
        answer: "Check your notification settings in your profile and ensure notifications are enabled in your browser settings."
      }
    ]
  };

  const supportChannels = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our experts",
      availability: "Mon-Fri 9AM-6PM",
      contact: "+91 98765 43210",
      action: "Call Now",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      href: "tel:+919876543210"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send detailed questions",
      availability: "Response in 24 hours",
      contact: "support@aloka.com",
      action: "Send Email",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      href: "mailto:support@aloka.com"
    }
  ];

  const filteredFAQs = faqCategories[selectedCategory]?.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Navigate to ticket detail page
  const handleTicketClick = (ticketId) => {
    router.push(`/partner/support/${ticketId}`);
  };

  const handleTicketCreated = (newTicket) => {
    // The useMyTickets query will automatically refetch due to query invalidation
    console.log('Ticket created successfully:', newTicket);
  };

  // Get recent tickets (last 3)
  const recentTickets = ticketsData?.data?.slice(0, 3) || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#892580] to-[#a12d8a] rounded-xl text-white p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Support Center</h1>
        <p className="text-white/90 text-sm mb-4">
          Find answers, get help, or contact our support team
        </p>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Support Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportChannels.map((channel, index) => {
              const IconComponent = channel.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 ${channel.bgColor} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <IconComponent className={`w-5 h-5 ${channel.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{channel.title}</h3>
                      <p className="text-xs text-gray-600 mb-1">{channel.description}</p>
                      <p className="text-xs text-gray-500 mb-2">{channel.availability}</p>
                      <p className="text-xs font-medium text-gray-900 mb-2">{channel.contact}</p>
                      <a
                        href={channel.href}
                        className={`block w-full ${channel.color} text-white py-1.5 px-3 rounded-md hover:opacity-90 transition-opacity text-xs font-medium text-center`}
                      >
                        {channel.action}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Ticket Card */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Submit Support Ticket</h3>
                  <p className="text-xs text-gray-600">Report issues or request features</p>
                </div>
              </div>
              <button
                onClick={() => setShowTicketModal(true)}
                className="bg-[#892580] text-white px-4 py-2 rounded-lg hover:bg-[#a12d8a] transition-colors text-xs font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Ticket
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
              <button className="text-[#892580] hover:text-[#a12d8a] text-xs font-medium flex items-center space-x-1">
                <span>View All</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* FAQ Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(faqCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#892580] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-2">
              {filteredFAQs?.slice(0, 3).map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <details className="group">
                    <summary className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-3 pb-3">
                      <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Tickets */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Recent Tickets</h3>
              <button 
                onClick={() => router.push('/partner/support/tickets')}
                className="text-[#892580] hover:text-[#a12d8a] text-xs font-medium"
              >
                View All
              </button>
            </div>
            
            {ticketsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : ticketsError ? (
              <div className="text-center py-4">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Failed to load tickets</p>
              </div>
            ) : recentTickets.length === 0 ? (
              <div className="text-center py-4">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No tickets yet</p>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="text-[#892580] hover:text-[#a12d8a] text-xs font-medium mt-1"
                >
                  Create your first ticket
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTickets.map((ticket) => (
                  <div 
                    key={ticket._id} 
                    onClick={() => handleTicketClick(ticket._id)}
                    className="p-2 border border-gray-200 rounded-lg hover:border-[#892580] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-900">{ticket.ticketId}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span className="capitalize">{ticket.status.replace('-', ' ')}</span>
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3 h-3 text-gray-400 hover:text-[#892580]" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1 truncate">{ticket.title}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs capitalize ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority} priority
                      </span>
                      <p className="text-xs text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Contact */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                  <Phone className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="text-xs font-medium text-gray-900">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                  <Mail className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-xs font-medium text-gray-900">support@aloka.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                  <Clock className="w-3 h-3 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Hours</p>
                  <p className="text-xs font-medium text-gray-900">24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default PartnerSupportPage;