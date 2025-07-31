import CalendarDay from "./CalenderDay";

const CalendarGrid = ({ calendarDays, onDateClick, getTeamMember, getStatusColor }) => (
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
        <CalendarDay
          key={index}
          day={day}
          onDateClick={onDateClick}
          getTeamMember={getTeamMember}
          getStatusColor={getStatusColor}
        />
      ))}
    </div>
  </div>
);
export default CalendarGrid