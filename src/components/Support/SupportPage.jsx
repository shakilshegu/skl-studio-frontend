'use client'
import { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Headphones,
  ArrowRight,
  Star,
  Users,
  CheckCircle,
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  Tag,
  Flag,
  Eye,
  AlertCircle,
  XCircle,
  RefreshCw,
  HelpCircle,
  Zap,
  Shield,
  Heart
} from 'lucide-react';
import MyTicketsList from './MyTicketsList';
import TicketDetailView from './TicketDetailView';
import RaiseTicketModal from '../My-Booking/RaiseTicketModal';

const SupportPage = ({ booking = null }) => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Handle viewing a specific ticket
  const handleViewTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    setCurrentView('detail');
  };

  // Handle going back to tickets list
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTicketId(null);
  };

  // Handle opening create ticket modal
  const handleCreateTicket = () => {
    setIsCreateModalOpen(true);
  };

  // Handle closing create ticket modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Handle successful ticket creation
  const handleTicketCreated = (newTicket) => {
    console.log('New ticket created:', newTicket);
    setIsCreateModalOpen(false);
    
    // Optionally navigate to the new ticket
    const ticketId = newTicket?.data?._id || newTicket?._id;
    if (ticketId) {
      // Small delay to ensure the ticket is in cache
      setTimeout(() => {
        handleViewTicket(ticketId);
      }, 500);
    }
  };

  const SupportHero = () => (
    <div className="relative bg-gradient-to-br from-brand-primary via-brand-600 to-brand-700 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-60 right-80 w-24 h-24 bg-white rounded-full blur-xl"></div>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <span className="text-brand-100 font-medium">24/7 Support Available</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              We're Here to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-brand-accent">
                Help You
              </span>
            </h1>
            
            <p className="text-xl text-brand-100 mb-8 leading-relaxed">
              Get instant support, track your tickets, and connect with our expert team. 
              Your satisfaction is our priority.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleCreateTicket}
                className="px-8 py-4 bg-white text-brand-primary rounded-xl font-semibold hover:bg-brand-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Create Support Ticket
              </button>
              
              <button className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-3 backdrop-blur-sm">
                <MessageCircle className="w-5 h-5" />
                Live Chat
              </button>
            </div>
            
            {/* Support Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-brand-200">Support Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">2min</div>
                <div className="text-sm text-brand-200">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-sm text-brand-200">Satisfaction</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Contact Cards */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Phone Support</h3>
                  <p className="text-brand-200">Speak directly with our team</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <span className="font-medium">+91 9876543210</span>
                  <span className="text-green-300 text-sm">(Primary)</span>
                </div>
                <div className="flex items-center gap-2 text-brand-200">
                  <span>+91 9876543211</span>
                  <span className="text-sm">(Secondary)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary-500 rounded-xl">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Email Support</h3>
                  <p className="text-brand-200">Get detailed assistance</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-white font-medium">support@yourcompany.com</div>
                <div className="text-brand-200 text-sm">Response within 1 hour</div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-accent rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Visit Us</h3>
                  <p className="text-brand-200">Our office location</p>
                </div>
              </div>
              <div className="text-brand-200 text-sm">
                123 Business Park, Tech City<br />
                Kozhikode, Kerala 673001<br />
                India
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SupportFeatures = () => (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Support?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience world-class support with our dedicated team and cutting-edge tools
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Average response time under 2 minutes</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Team</h3>
            <p className="text-gray-600">Certified professionals ready to help</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Available</h3>
            <p className="text-gray-600">Round-the-clock support when you need it</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Touch</h3>
            <p className="text-gray-600">Personalized support for every customer</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SupportHours = () => (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Support Hours & Contact Information
          </h2>
          <p className="text-gray-600">
            Multiple ways to reach us, whenever you need assistance
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-brand-50 to-primary-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-brand-600" />
              <h3 className="text-xl font-semibold text-gray-900">Support Hours</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Monday - Friday</span>
                <span className="font-medium text-gray-900">9:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Saturday</span>
                <span className="font-medium text-gray-900">10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sunday</span>
                <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Emergency support available 24/7</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-primary-50 to-brand-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-8 h-8 text-primary-600" />
              <h3 className="text-xl font-semibold text-gray-900">Quick Contact</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-900">+91 9876543210</div>
                  <div className="text-sm text-gray-600">Primary support line</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-900">support@yourcompany.com</div>
                  <div className="text-sm text-gray-600">Email support</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-900">Live Chat</div>
                  <div className="text-sm text-gray-600">Available on website</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentView === 'detail') {
    return (
      <div className="min-h-screen bg-gray-50">
        <TicketDetailView
          ticketId={selectedTicketId}
          onBack={handleBackToList}
        />
        
        {/* Create Ticket Modal */}
        <RaiseTicketModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          booking={booking}
          onTicketCreated={handleTicketCreated}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <SupportHero />
      
      {/* Support Features */}
      <SupportFeatures />
      
      {/* Support Hours */}
      <SupportHours />
      
      {/* Tickets List */}
      <div className="bg-gray-50 py-16">
        <MyTicketsList
          onViewTicket={handleViewTicket}
          onCreateTicket={handleCreateTicket}
        />
      </div>
      
      {/* Create Ticket Modal */}
      <RaiseTicketModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        booking={booking}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
};

export default SupportPage;