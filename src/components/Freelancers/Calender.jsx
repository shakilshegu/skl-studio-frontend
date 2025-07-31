"use client";
import { useState } from "react";

const timeSlots = [
  "08-10AM",
  "10-12PM",
  "12-02PM",
  "02-04PM",
  "04-06PM",
  "06-08PM",
];

const BookSlot = () => {
  const [mode, setMode] = useState("Hourly");
  const [date, setDate] = useState("25 Mar");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [showTimes, setShowTimes] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleTimeChange = (slot) => {
    setSelectedTimes((prev) =>
      prev.includes(slot)
        ? prev.filter((time) => time !== slot)
        : [...prev, slot]
    );
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-xl border shadow-md bg-white">
      <h2 className="text-center font-semibold text-lg mb-4">Book your slot</h2>

      <div className="flex items-center justify-center mb-4 bg-gray-100 rounded-md border overflow-hidden">
        <button
          className={`flex-1 py-2 text-sm font-medium ${mode === "Hourly" ? "bg-white text-black border" : "text-gray-400"
            }`}
          onClick={() => setMode("Hourly")}
        >
          Hourly
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${mode === "Days" ? "bg-white text-black border" : "text-gray-400"
            }`}
          onClick={() => setMode("Days")}
        >
          Days
        </button>
      </div>

      <div className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-purple-300"
          >
            <option>25 Mar</option>
            <option>26 Mar</option>
            <option>27 Mar</option>
          </select>
        </div>

        {/* Time (Multi-select) */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Time</label>
          <button
            className="w-full border px-3 py-2 rounded text-left relative focus:outline-none focus:ring focus:ring-purple-300"
            onClick={() => setShowTimes(!showTimes)}
          >
            {selectedTimes.length > 0
              ? selectedTimes.join(", ")
              : "Select Time Slots"}
            <span className="absolute right-3 top-2">&#x25BC;</span>
          </button>
          {showTimes && (
            <div className="absolute z-10 w-full bg-white border rounded shadow-md mt-1 max-h-40 overflow-y-auto">
              {timeSlots.map((slot, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-purple-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedTimes.includes(slot)}
                    onChange={() => handleTimeChange(slot)}
                  />
                  {slot}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-2 text-sm text-gray-400 justify-center my-2">
          <div className="flex-1 h-px bg-gray-300" />
          OR
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Time of Day Options */}
        <div className="space-y-2 text-sm">
          {["First Half", "Second Half", "Full Day"].map((label) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="slotOption"
                value={label}
                checked={selectedOption === label}
                onChange={() => setSelectedOption(label)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookSlot;
