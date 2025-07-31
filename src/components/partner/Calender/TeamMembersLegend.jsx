import React from "react";

const TeamMembersLegend = ({ teamMembers }) => {
  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate color based on team member ID or name
  const getColor = (member) => {
    if (member.color) return member.color;
    
    // Generate color based on member ID or name
    const colors = [
      '#892580', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];
    
    const index = member._id ? 
      member._id.slice(-1).charCodeAt(0) % colors.length :
      member.name.length % colors.length;
    
    return colors[index];
  };

  // Determine status (you might want to add a status field to your team member model)
  const getStatus = (member) => {
    return member.status || 'available'; // Default to available if no status
  };

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-700">Team Members</h3>
          <span className="text-sm text-gray-500">0 members</span>
        </div>
        <p className="text-sm text-gray-500">No team members found</p>
      </div>
    );
  }

  return (
    <div className="p-4 border-b bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700">Team Members</h3>
        <span className="text-sm text-gray-500">
          {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {teamMembers.map((member) => (
          <div key={member._id || member.id} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: getColor(member) }}
              title={member.name}
            >
              {getInitials(member.name)}
            </div>
            <span className="text-sm text-gray-600 truncate max-w-24" title={member.name}>
              {member.name}
            </span>
            {member.role && (
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                {member.role}
              </span>
            )}
            <span
              className={`w-2 h-2 rounded-full ${
                getStatus(member) === "available" ? "bg-green-500" : "bg-orange-500"
              }`}
              title={getStatus(member)}
            ></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembersLegend;