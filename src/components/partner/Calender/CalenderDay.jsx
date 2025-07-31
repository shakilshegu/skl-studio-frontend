import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

const CalendarDay = ({ day, onDateClick, getTeamMember, getStatusColor }) => {
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate color for team member if not provided
  const getMemberColor = (member) => {
    if (!member) return '#892580';
    if (member.color) return member.color;
    
    const colors = [
      '#892580', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];
    
    const index = member._id ? 
      member._id.slice(-1).charCodeAt(0) % colors.length :
      member.name.length % colors.length;
    
    return colors[index];
  };

  // Get team member info for booking
  const getBookingTeamMembers = (booking) => {
    if (!booking.helpers || booking.helpers.length === 0) {
      // Fallback to entity info if no helpers
      return booking.entity ? [{ 
        _id: booking.entity.id, 
        name: booking.entity.name,
        initials: getInitials(booking.entity.name)
      }] : [];
    }
    
    return booking.helpers.map(helper => ({
      _id: helper.id,
      name: helper.name,
      initials: getInitials(helper.name)
    }));
  };

  return (
    <div
      onClick={() => onDateClick(day)}
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
        {day.bookings.slice(0, 3).map(booking => {
          const teamMembers = getBookingTeamMembers(booking);
          const firstMember = teamMembers[0];
          
          return (
            <div
              key={booking.id}
              className={`text-xs p-1 rounded-md border-l-2 bg-white shadow-sm ${getStatusColor(booking.status)}`}
              style={{ borderLeftColor: getMemberColor(firstMember) }}
            >
              <div className="font-medium truncate" title={booking.title}>
                {booking.title}
              </div>
              <div className="flex items-center gap-1 text-xs opacity-75">
                <Clock size={10} />
                {booking.startTime}
              </div>
              
              {/* Client name if available */}
              {booking.client?.name && (
                <div className="text-xs opacity-75 truncate" title={booking.client.name}>
                  {booking.client.name}
                </div>
              )}
              
              {/* Team member avatars */}
              {teamMembers.length > 0 && (
                <div className="flex -space-x-1 mt-1">
                  {teamMembers.slice(0, 3).map(member => (
                    <div
                      key={member._id}
                      className="w-4 h-4 rounded-full border border-white text-white text-xs flex items-center justify-center"
                      style={{ backgroundColor: getMemberColor(member) }}
                      title={member.name}
                    >
                      {member.initials?.charAt(0) || getInitials(member.name).charAt(0)}
                    </div>
                  ))}
                  {teamMembers.length > 3 && (
                    <div className="w-4 h-4 rounded-full bg-gray-400 border border-white text-white text-xs flex items-center justify-center">
                      +
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Show more indicator */}
        {day.bookings.length > 3 && (
          <div className="text-xs text-gray-500 text-center py-1">
            +{day.bookings.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;