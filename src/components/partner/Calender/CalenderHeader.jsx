import React from 'react';
import {  
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Users,
  Filter,
  Search
} from 'lucide-react';
const CalendarHeader = ({ 
  currentDate, 
  goToPreviousMonth, 
  goToNextMonth, 
  goToToday, 
  searchTerm, 
  setSearchTerm, 
  onAddLead 
}) => (
  <div className="bg-[#892580] text-white p-6">
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
        
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
        >
          Today
        </button>
        
        <button
          onClick={onAddLead}
          className="flex items-center gap-2 px-4 py-2 bg-white text-[#892580] rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          <Plus size={16} />
          Add Lead
        </button>
      </div>
    </div>
  </div>
);
export default CalendarHeader