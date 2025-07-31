"use client";
import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  MapPin, 
  Plus, 
  X, 
  Eye,
  Users,
  Camera,
  CheckCircle,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react';

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample team members data
  const teamMembers = [
    { id: 1, name: "John Doe", role: "Photographer", initials: "JD", color: "#892580", status: "available" },
    { id: 2, name: "Jane Smith", role: "Videographer", initials: "JS", color: "#10B981", status: "busy" },
    { id: 3, name: "Mike Johnson", role: "Editor", initials: "MJ", color: "#F59E0B", status: "available" },
    { id: 4, name: "Sarah Wilson", role: "Assistant", initials: "SW", color: "#EF4444", status: "available" },
    { id: 5, name: "Alex Brown", role: "Photographer", initials: "AB", color: "#8B5CF6", status: "busy" }
  ];

  // Sample bookings data with team member assignments
  const [bookings, setBookings] = useState([
    {
      id: "ALK2505240930",
      title: "Wedding Photography",
      date: new Date(2025, 4, 25),
      startTime: "09:00",
      endTime: "17:00",
      client: "John & Sarah Wedding",
      location: "Grand Hotel Ballroom",
      status: "confirmed",
      teamMembers: [1, 2],
      type: "event",
      amount: 45000,
      notes: "Full day wedding coverage with 2 photographers and 1 videographer"
    },
    {
      id: "ALK2505250830",
      title: "Portrait Session",
      date: new Date(2025, 4, 25),
      startTime: "14:00",
      endTime: "16:00",
      client: "Emma Thompson",
      location: "Studio A",
      status: "confirmed",
      teamMembers: [3],
      type: "portrait",
      amount: 8000,
      notes: "Professional headshots"
    },
    {
      id: "ALK2505261000",
      title: "Product Photography",
      date: new Date(2025, 4, 26),
      startTime: "10:00",
      endTime: "13:00",
      client: "TechGadgets Inc",
      location: "Studio B",
      status: "pending",
      teamMembers: [1, 4],
      type: "commercial",
      amount: 15000,
      delivery: new Date(2025, 4, 28),
      notes: "E-commerce product shots for new smartphone line"
    },
    {
      id: "ALK2505271130",
      title: "Corporate Event",
      date: new Date(2025, 4, 27),
      startTime: "11:30",
      endTime: "15:30",
      client: "Innovate Corp",
      location: "Convention Center",
      status: "confirmed",
      teamMembers: [2, 5],
      type: "event",
      amount: 25000,
      delivery: new Date(2025, 4, 30),
      notes: "Annual company conference documentation"
    }
  ]);

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get calendar days for the current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41); // 6 weeks

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
        hasDelivery: dayBookings.some(booking => booking.delivery && 
          booking.delivery.toDateString() === date.toDateString())
      });
    }

    return days;
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date) => {
    return bookings.filter(booking => 
      booking.date.toDateString() === date.toDateString()
    );
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

  // Get team member info
  const getTeamMember = (id) => {
    return teamMembers.find(member => member.id === id);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter team members
  const filteredTeamMembers = teamMembers.filter(member =>
    selectedTeamMembers.length === 0 || selectedTeamMembers.includes(member.id)
  );

  const calendarDays = getCalendarDays();

  return (
    <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#892580] to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon size={24} />
            <h1 className="text-xl font-semibold">Calendar Management</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            
            {/* Team Filter */}
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-colors">
                <Users size={16} />
                <span>Team Filter</span>
                <Filter size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-2xl font-bold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
            >
              Today
            </button>
            
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#892580] rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <Plus size={16} />
              Add Lead
            </button>
          </div>
        </div>
      </div>

      {/* Team Members Legend */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-700">Team Members</h3>
          <span className="text-sm text-gray-500">{teamMembers.length} members</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {teamMembers.map(member => (
            <div key={member.id} className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>
              <span className="text-sm text-gray-600">{member.name}</span>
              <span className={`w-2 h-2 rounded-full ${member.status === 'available' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        {/* Week header */}
        <div className="grid grid-cols-7 border-b bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-0">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`min-h-32 p-2 border-r border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                !day.isCurrentMonth ? 'bg-gray-100/50 text-gray-400' : ''
              } ${day.isToday ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              {/* Date number */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  day.isToday ? 'text-blue-600' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {day.day}
                </span>
                
                {/* Delivery indicator */}
                {day.hasDelivery && (
                  <CheckCircle className="text-green-500" size={14} />
                )}
              </div>

              {/* Bookings */}
              <div className="space-y-1">
                {day.bookings.slice(0, 3).map(booking => (
                  <div
                    key={booking.id}
                    className={`text-xs p-1 rounded-md border-l-2 bg-white shadow-sm ${getStatusColor(booking.status)}`}
                    style={{ borderLeftColor: getTeamMember(booking.teamMembers[0])?.color || '#892580' }}
                  >
                    <div className="font-medium truncate">{booking.title}</div>
                    <div className="flex items-center gap-1 text-xs opacity-75">
                      <Clock size={10} />
                      {booking.startTime}
                    </div>
                    
                    {/* Team member avatars */}
                    <div className="flex -space-x-1 mt-1">
                      {booking.teamMembers.slice(0, 3).map(memberId => {
                        const member = getTeamMember(memberId);
                        return (
                          <div
                            key={memberId}
                            className="w-4 h-4 rounded-full border border-white text-white text-xs flex items-center justify-center"
                            style={{ backgroundColor: member?.color }}
                            title={member?.name}
                          >
                            {member?.initials.charAt(0)}
                          </div>
                        );
                      })}
                      {booking.teamMembers.length > 3 && (
                        <div className="w-4 h-4 rounded-full bg-gray-400 border border-white text-white text-xs flex items-center justify-center">
                          +
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Show more indicator */}
                {day.bookings.length > 3 && (
                  <div className="text-xs text-gray-500 text-center py-1">
                    +{day.bookings.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-[#892580] to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Bookings for {selectedDate?.toLocaleDateString('en-US', { 
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
                  })}
                </h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {selectedBookings.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600">No bookings for this date</p>
                  <button
                    onClick={() => {
                      setShowBookingModal(false);
                      setShowAddLeadModal(true);
                    }}
                    className="mt-4 px-4 py-2 bg-[#892580] text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add New Lead
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedBookings.map(booking => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{booking.title}</h4>
                          <p className="text-sm text-gray-600">#{booking.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="text-gray-400" size={16} />
                          <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="text-gray-400" size={16} />
                          <span>{booking.client}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="text-gray-400" size={16} />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Camera className="text-gray-400" size={16} />
                          <span>₹{booking.amount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Team Members */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Assigned Team:</p>
                        <div className="flex items-center gap-2">
                          {booking.teamMembers.map(memberId => {
                            const member = getTeamMember(memberId);
                            return (
                              <div key={memberId} className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                  style={{ backgroundColor: member?.color }}
                                >
                                  {member?.initials}
                                </div>
                                <span className="text-sm text-gray-600">{member?.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Delivery Date */}
                      {booking.delivery && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="text-green-500" size={16} />
                            <span className="text-gray-600">
                              Delivery: {booking.delivery.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Notes */}
                      {booking.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          {booking.notes}
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-4">
                        <button className="flex items-center gap-2 px-4 py-2 text-[#892580] bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                          <Eye size={16} />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-[#892580] to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Add New Lead</h3>
                <button
                  onClick={() => setShowAddLeadModal(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto mb-4 text-[#892580]" size={48} />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Create Lead for {selectedDate?.toLocaleDateString()}
                </h4>
                <p className="text-gray-600 mb-6">
                  You'll be redirected to the Lead Management page to create a new lead for this date.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddLeadModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowAddLeadModal(false);
                      // Navigate to lead management page
                      window.location.href = '/partner/leads/new';
                    }}
                    className="flex-1 px-4 py-2 bg-[#892580] text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;