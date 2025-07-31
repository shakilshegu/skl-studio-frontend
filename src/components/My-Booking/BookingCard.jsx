import BookingCalendar from "../../../public/Assets/BookingCard/BookingCalender";
import Location from "../../../public/Assets/BookingCard/Location";
import Star from "../../../public/Assets/BookingCard/Star";
import BookingCalenderIcon from "../../../public/Assets/svg/BookingCalenderIcon";

const blue = "/Assets/blue.png";
const red = "/Assets/red.png";
const orange = "/Assets/orange.png";

const BookingCard = () => {
    const bookings = [
        {
            status: "UPCOMING",
            StartTime: "09 AM",
            EndTime: "12 PM",
            name: "Peter Parker",
            date: "24 Oct 2024",
            location: "Medhipur, Hyderabad",
            price: "10,000",
            paymentStatus: "PAID",
            remarks: "Meeting with the client",
        },
        {
            status: "CANCELLED",
            StartTime: "09 AM",
            EndTime: "12 PM",
            name: "Bruce Wayne",
            date: "25 Oct 2024",
            location: "Gotham City",
            price: "8,000",
            paymentStatus: "UNPAID",
            remarks: "Client canceled the appointment",
        },
        {
            status: "COMPLETED",
            StartTime: "09 AM",
            EndTime: "12 PM",
            name: "Clark Kent",
            date: "26 Oct 2024",
            location: "Metropolis",
            price: "12,000",
            paymentStatus: "PAID",
            remarks: "Successfully completed",
        },
        {
            status: "ONGOING",
            StartTime: "10 AM",
            EndTime: "02 PM",
            name: "Diana Prince",
            date: "27 Oct 2024",
            location: "Themyscira",
            price: "15,000",
            paymentStatus: "PAID",
            remarks: "Currently in progress",
        },
    ];

    return (
        <div className="flex flex-wrap gap-4 p-6">
            {bookings.map((booking, index) => {
                let backgroundImage;

                switch (booking.status) {
                    case "UPCOMING":
                        backgroundImage = `url(${orange})`;
                        break;
                    case "COMPLETED":
                        backgroundImage = `url(${blue})`;
                        break;
                    case "CANCELLED":
                        backgroundImage = `url(${red})`;
                        break;
                    case "ONGOING":
                        backgroundImage = `url(${blue})`;
                        break;
                    default:
                        backgroundImage = `url(${orange})`;
                        break;
                }

                return (
                    <div
                        key={index}
                        className="border rounded-lg p-4 shadow-sm w-[400px] h-[250px] relative"
                    >
                        {/* Status Label */}
                        <span
                            className="inline-flex items-center justify-center text-white text-[12px] text-center font-bold absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cover bg-center"
                            style={{
                                backgroundImage: backgroundImage,
                                width: "100px",
                                height: "20px",
                            }}
                        >
                            {booking.status}
                        </span>

                        {/* Time Details */}
                        <div className="flex justify-between items-center mb-2 pb-2 border-b">
                            <span className="font-bold">{booking.StartTime}</span>
                            <span className="bg-blue-600 p-2 rounded-full inline-block">
                                <BookingCalenderIcon />
                            </span>
                            <span className="font-bold">{booking.EndTime}</span>
                        </div>

                        {/* Booking Details */}
                        <div className="mb-1 border-b">
                            <div className="flex justify-between">
                                <p className="font-normal">{booking.name}</p>
                                <p className="text-sm font-semibold text-gray-500 flex items-center space-x-2">
                                    <span className="p-2 rounded-full">
                                        <BookingCalendar />
                                    </span>
                                    {booking.date}
                                </p>
                                <p className="text-sm font-normal text-gray-500 flex items-center space-x-2">
                                    <span className="p-2 rounded-full">
                                        <Star />
                                    </span>
                                    4.5
                                </p>
                            </div>
                            <p className="text-sm font-normal text-gray-500 flex items-center space-x-2">
                                <span className="p-2">
                                    <Location />
                                </span>
                                {booking.location}
                            </p>
                        </div>

                        {/* Payment Details */}
                        <div className="mb-2">
                            <div className="flex justify-around">
                                <p className="font-semibold">₹{booking.price}</p>
                                <p
                                    className={`text-sm ${booking.paymentStatus === "PAID"
                                            ? "text-green-500"
                                            : "text-red-500"
                                        }`}
                                >
                                    {booking.paymentStatus}
                                </p>
                            </div>
                            <p className="font-semibold text-center">
                                {booking.remarks}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BookingCard;
