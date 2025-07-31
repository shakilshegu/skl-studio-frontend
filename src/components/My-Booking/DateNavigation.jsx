import React, { useState } from "react";
import LeftIcon from "../../../public/Assets/BookingCard/LeftIcon";
import RightIcon from "../../../public/Assets/BookingCard/RightIcon";

const DateNavigation = () => {
  const [currentDate, setCurrentDate] = useState(1);

  // Generate dates dynamically from 1 to 31
  const dates = Array.from({ length: 31 }, (_, index) => ({
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      new Date(2024, 11, index + 1).getDay()
    ],
    date: index + 1,
    active: currentDate === index + 1, 
  }));

  const handleDateChange = (direction) => {
    if (direction === "prev") {
      setCurrentDate((prev) => (prev > 1 ? prev - 1 : 31));
    } else if (direction === "next") {
      setCurrentDate((prev) => (prev < 31 ? prev + 1 : 1));
    } else {
      setCurrentDate(direction.date);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <p
          onClick={() => handleDateChange("prev")}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <span className="rounded">
            <LeftIcon />
          </span>
        </p>
        <p className="font-bold">Dec 2024</p>
        <p
          onClick={() => handleDateChange("next")}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <span>
            <RightIcon />
          </span>
        </p>
      </div>
      <div className="flex items-center justify-between  py-2  rounded-lg mb-4">
        {/* Dates Navigation */}
        <div className="flex overflow-x-auto gap-1 scrollbar-hide items-center">
          {dates.map((date) => (
            <button
              key={date.date}
              onClick={() => handleDateChange(date)}
              className={`flex flex-col items-center justify-center w-[50px] h-18  rounded-md border ${date.active
                  ? "border-blue-500 bg-blue-100 text-blue-600"
                  : "border-gray-300 bg-white text-gray-500"
                }`}
            >
              <p className="text-sm mt-2 font-medium">{date.date}</p>
              <p className="text-xs">{date.day}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateNavigation;
