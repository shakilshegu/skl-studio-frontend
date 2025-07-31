'use client'
import { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      {currentView === 'list' ? (
        <MyTicketsList
          onViewTicket={handleViewTicket}
          onCreateTicket={handleCreateTicket}
        />
      ) : (
        <TicketDetailView
          ticketId={selectedTicketId}
          onBack={handleBackToList}
        />
      )}

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