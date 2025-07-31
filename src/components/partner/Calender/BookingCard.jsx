import { Camera, CheckCircle, Clock, Eye, MapPin, User, IndianRupee } from "lucide-react";

const BookingCard = ({ booking, getTeamMember, getStatusColor, onViewDetails }) => {
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
      (member.name || '').length % colors.length;
    
    return colors[index];
  };

  // Get location text from entity
  const getLocationText = (entity) => {
    if (!entity) return 'N/A';
    
    // Handle location object with lat/lng
    if (entity.location && typeof entity.location === 'object') {
      if (entity.location.lat && entity.location.lng) {
        return `${entity.location.lat.toFixed(4)}, ${entity.location.lng.toFixed(4)}`;
      }
      return 'Location coordinates';
    }
    
    // Handle location as string
    if (entity.location && typeof entity.location === 'string') {
      return entity.location;
    }
    
    // Fallback to entity name
    return entity.name || 'N/A';
  };
  const getTeamMembers = () => {
    const members = [];
    
    // Add helpers
    if (booking.helpers && booking.helpers.length > 0) {
      booking.helpers.forEach(helper => {
        members.push({
          _id: helper.id,
          name: helper.name,
          role: helper.specialization || 'Helper',
          initials: getInitials(helper.name)
        });
      });
    }
    
    // If no helpers, add entity as team member
    if (members.length === 0 && booking.entity) {
      members.push({
        _id: booking.entity.id,
        name: booking.entity.name,
        role: booking.entity.type === 'studio' ? 'Studio' : 'Freelancer',
        initials: getInitials(booking.entity.name)
      });
    }
    
    return members;
  };

  const teamMembers = getTeamMembers();
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get services/packages summary
  const getServicesSummary = () => {
    const items = [];
    
    if (booking.services && booking.services.length > 0) {
      items.push(...booking.services.map(service => service.name));
    }
    
    if (booking.packages && booking.packages.length > 0) {
      items.push(...booking.packages.map(pkg => pkg.name));
    }
    
    if (items.length === 0) {
      return booking.title || 'Booking';
    }
    
    return items.join(', ');
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{booking.title}</h4>
          <p className="text-sm text-gray-600">#{booking.customBookingId || booking.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="text-gray-400" size={16} />
          <span>{booking.startTime} - {booking.endTime}</span>
          {booking.isWholeDay && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs ml-2">
              Whole Day
            </span>
          )}
        </div>
        
        {/* Client Details */}
        <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
          <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <User className="text-blue-600" size={16} />
            Client Details
          </h5>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-800">Name:</span>
              <span className="text-blue-700">{booking.client?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-800">Email:</span>
              <span className="text-blue-700 truncate" title={booking.client?.email}>
                {booking.client?.email || 'N/A'}
              </span>
            </div>
            {booking.client?.phone && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-800">Phone:</span>
                <span className="text-blue-700">{booking.client.phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="text-gray-400" size={16} />
          <span className="truncate" title={getLocationText(booking.entity)}>
            {getLocationText(booking.entity)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <IndianRupee className="text-gray-400" size={16} />
          <span className="font-semibold text-green-600">{formatCurrency(booking.totalAmount || 0)}</span>
        </div>
      </div>

      {/* Services/Packages Summary */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Services:</p>
        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
          {getServicesSummary()}
        </p>
      </div>
      
      {/* Team Members */}
      {teamMembers.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Assigned Team:</p>
          <div className="flex items-center gap-2 flex-wrap">
            {teamMembers.map(member => (
              <div key={member._id} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: getMemberColor(member) }}
                  title={member.name}
                >
                  {member.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">{member.name}</span>
                  {member.role && (
                    <span className="text-xs text-gray-500">{member.role}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Status */}
      {booking.paymentStatus && (
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Payment:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
              booking.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
              booking.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
            </span>
          </div>
        </div>
      )}
      
      {/* Notes */}
      {booking.notes && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            {booking.notes}
          </div>
        </div>
      )}
      
      {/* Booking Duration */}
      {(booking.duration || booking.isWholeDay) && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="text-gray-400" size={16} />
            {booking.isWholeDay ? (
              <span>Whole Day Event</span>
            ) : (
              <span>Duration: {booking.duration} hours</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;