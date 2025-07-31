import { useState } from "react";

export const useSlotSelection = (slots, onTimeRangeChange) => {
  const [selectedSlots, setSelectedSlots] = useState(new Set());
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);

  const handleSlotSelection = (slotId) => {
    setSelectedSlots((prevSelected) => {
      const updatedSelectedSlots = new Set(prevSelected);

      if (updatedSelectedSlots.has(slotId)) {
        updatedSelectedSlots.delete(slotId);
        setSelectedTimeRange(null);
        onTimeRangeChange(null); // Clear range in parent
      } else {
        updatedSelectedSlots.add(slotId);

        const selectedSlotDetails = Array.from(updatedSelectedSlots)
          .map((id) => slots.find((slot) => slot._id === id))
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        const startSlot = selectedSlotDetails[0];
        const endSlot = selectedSlotDetails[selectedSlotDetails.length - 1];

        if (startSlot && endSlot) {
          const range = {
            startTime: startSlot.startTime,
            endTime: endSlot.endTime,
          };
          setSelectedTimeRange(range);
          onTimeRangeChange(range); // Pass range to parent
        }
      }

      return updatedSelectedSlots;
    });
  };

  return { selectedSlots, selectedTimeRange, handleSlotSelection };
};
