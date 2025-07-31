import { X } from "lucide-react";

// Add Lead Modal Component
const AddLeadModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  leadForm, 
  onFormChange, 
  onSubmit, 
  teamMembers, 
  onToggleTeamMember 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden">
        <div className="bg-[#892580] text-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Create New Lead</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-white/80 text-sm mt-2">
            {selectedDate?.toLocaleDateString('en-US', { 
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Client Information */}
            <div className="md:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Client Information</h4>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={leadForm.clientName}
                onChange={(e) => onFormChange('clientName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
                placeholder="Enter client name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={leadForm.clientPhone}
                onChange={(e) => onFormChange('clientPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
                placeholder="+91 9876543210"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={leadForm.clientEmail}
                onChange={(e) => onFormChange('clientEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
                placeholder="client@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lead Source
              </label>
              <select
                value={leadForm.source}
                onChange={(e) => onFormChange('source', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
              >
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social_media">Social Media</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>
            
            {/* Event Details */}
            <div className="md:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 mt-6">Event Details</h4>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <select
                required
                value={leadForm.eventType}
                onChange={(e) => onFormChange('eventType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
              >
                <option value="">Select event type</option>
                <option value="wedding">Wedding</option>
                <option value="portrait">Portrait Session</option>
                <option value="commercial">Commercial</option>
                <option value="event">Corporate Event</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={leadForm.location}
                onChange={(e) => onFormChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
                placeholder="Event location or Studio"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={leadForm.startTime}
                onChange={(e) => onFormChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={leadForm.endTime}
                onChange={(e) => onFormChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Budget (₹)
              </label>
              <input
                type="number"
                value={leadForm.estimatedBudget}
                onChange={(e) => onFormChange('estimatedBudget', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
                placeholder="50000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                value={leadForm.priority}
                onChange={(e) => onFormChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            {/* Team Assignment */}
            <div className="md:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 mt-6">Team Assignment</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {teamMembers.map(member => (
                  <div
                    key={member.id}
                    onClick={() => onToggleTeamMember(member.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      leadForm.assignedTeam.includes(member.id)
                        ? 'border-[#892580] bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes & Requirements
              </label>
              <textarea
                rows={3}
                value={leadForm.notes}
                onChange={(e) => onFormChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent"
                placeholder="Additional notes, special requirements, or client preferences..."
              />
            </div>
          </div>
          
          {/* Footer Buttons */}
          <div className="flex justify-between pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={onSubmit}
              className="px-6 py-2 bg-[#892580] text-white rounded-lg hover:bg-[#892580]"
            >
              Create Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddLeadModal