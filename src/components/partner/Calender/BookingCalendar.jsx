import { useState, useEffect } from "react";
import CalendarHeader from "./CalenderHeader";
import TeamMembersLegend from "./TeamMembersLegend";
import CalendarGrid from "./CalendarGrid";
import BookingDetailsModal from "./BookingDetails";
import AddLeadModal from "./AddLeadModal";
import { 
  useCalendarBookingsForMonth, 
  useTeamMembers, 
  usePrefetchCalendarData 
} from "../../../hooks/useBookingQueries";

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Lead form state
  const [leadForm, setLeadForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    eventType: '',
    location: '',
    startTime: '',
    endTime: '',
    estimatedBudget: '',
    assignedTeam: [],
    notes: '',
    priority: 'medium',
    source: 'website'
  });

  // Get month date range for API call
  const { prefetchMonth } = usePrefetchCalendarData();

  // Fetch calendar bookings for current month
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    error: bookingsError,
    refetch: refetchBookings
  } = useCalendarBookingsForMonth(currentDate, searchTerm);

  // Fetch team members
  const {
    data: teamMembersData,
    isLoading: teamMembersLoading,
    error: teamMembersError
  } = useTeamMembers();

  // Extract bookings and team members from API response
  const bookings = bookingsData?.data?.bookings || [];
  const teamMembers = teamMembersData?.data || [];

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
    // Prefetch previous month data
    prefetchMonth(new Date(newDate.getFullYear(), newDate.getMonth() - 1, 1), searchTerm);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    // Prefetch next month data
    prefetchMonth(new Date(newDate.getFullYear(), newDate.getMonth() + 1, 1), searchTerm);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
  };

  // Prefetch adjacent months on component mount
  useEffect(() => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    
    prefetchMonth(prevMonth, searchTerm);
    prefetchMonth(nextMonth, searchTerm);
  }, [currentDate, searchTerm, prefetchMonth]);

  // Get calendar days for the current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41);

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === new Date().toDateString();
      const dayBookings = getBookingsForDate(date);
      
      days.push({
        date: new Date(date),
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        bookings: dayBookings,
        hasDelivery: false // You can implement delivery logic if needed
      });
    }

    return days;
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      return bookingDate === dateString;
    });
  };

  // Handle date click
  const handleDateClick = (day) => {
    setSelectedDate(day.date);
    const dayBookings = getBookingsForDate(day.date);
    setSelectedBookings(dayBookings);
    if (dayBookings.length > 0) {
      setShowBookingModal(true);
    } else {
      setShowAddLeadModal(true);
    }
  };

  // Get team member info by ID
  const getTeamMember = (id) => {
    return teamMembers.find(member => member._id === id || member.id === id);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle lead form submission
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newLead = {
        id: `LEAD${Date.now()}`,
        ...leadForm,
        date: selectedDate,
        status: 'new',
        createdAt: new Date(),
        followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };
      
      console.log('Creating new lead:', newLead);
      
      setLeadForm({
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        eventType: '',
        location: '',
        startTime: '',
        endTime: '',
        estimatedBudget: '',
        assignedTeam: [],
        notes: '',
        priority: 'medium',
        source: 'website'
      });
      setShowAddLeadModal(false);
      
      alert('Lead created successfully!');
      
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  // Handle form input changes
  const handleLeadFormChange = (field, value) => {
    setLeadForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle team member assignment
  const toggleTeamMemberAssignment = (memberId) => {
    setLeadForm(prev => ({
      ...prev,
      assignedTeam: prev.assignedTeam.includes(memberId)
        ? prev.assignedTeam.filter(id => id !== memberId)
        : [...prev.assignedTeam, memberId]
    }));
  };

  const calendarDays = getCalendarDays();

  // Loading state
  if (bookingsLoading || teamMembersLoading) {
    return (
      <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#892580]"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (bookingsError || teamMembersError) {
    return (
      <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading calendar data</p>
            <button 
              onClick={() => refetchBookings()}
              className="px-4 py-2 bg-[#892580] text-white rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
        goToToday={goToToday}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddLead={() => setShowAddLeadModal(true)}
      />

      <TeamMembersLegend teamMembers={teamMembers} />

      <CalendarGrid
        calendarDays={calendarDays}
        onDateClick={handleDateClick}
        getTeamMember={getTeamMember}
        getStatusColor={getStatusColor}
      />

      <BookingDetailsModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedDate={selectedDate}
        selectedBookings={selectedBookings}
        onAddNewLead={() => {
          setShowBookingModal(false);
          setShowAddLeadModal(true);
        }}
        getTeamMember={getTeamMember}
        getStatusColor={getStatusColor}
      />

      <AddLeadModal
        isOpen={showAddLeadModal}
        onClose={() => setShowAddLeadModal(false)}
        selectedDate={selectedDate}
        leadForm={leadForm}
        onFormChange={handleLeadFormChange}
        onSubmit={handleLeadSubmit}
        teamMembers={teamMembers}
        onToggleTeamMember={toggleTeamMemberAssignment}
      />
    </div>
  );
};

export default BookingCalendar;