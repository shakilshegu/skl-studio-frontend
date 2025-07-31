// export default DateAndTime;
import React from 'react';
import moment from 'moment';
import BookNowCalender from "../../../public/Assets/studio/BookNowCalender";
import BookNowTime from "../../../public/Assets/studio/BookNowTime";

const DateAndTime = ({ bookings }) => {
    
    // Format date using moment
    const formatDate = (dateString) => {
        return moment(dateString).format('DD MMM YYYY');
    };
    
    // Get time range for the date
    const getTimeRange = (booking) => {
        if (booking.isWholeDay) {
            return `${booking.startTime}:00 - ${booking.endTime}:00 (${booking.endTime - booking.startTime}hrs)`;
        } else {
            // Get the earliest start time and latest end time from slots
            const startTime = booking.startTime;
            const endTime = booking.endTime;
            return `${startTime}:00 - ${endTime}:00 (${endTime - startTime}hrs)`;
        }
    };
    
    return (
        <div className="border rounded-lg mt-2">
            <div className="bg-gray-100 text-center font-semibold text-sm uppercase tracking-wider border-b rounded-t">
                Date & Time
            </div>
            
            <div className="p-4 space-y-3">
                {Object.entries(bookings).map(([date, booking]) => (
                    <div key={date} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                            <BookNowCalender className="mr-2" />
                            <p className="ml-1">{formatDate(date)}</p>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <BookNowTime className="mr-2" />
                            <p className="ml-1">{getTimeRange(booking)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DateAndTime;