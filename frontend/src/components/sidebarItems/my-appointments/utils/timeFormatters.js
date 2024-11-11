export const formatTimeSlots = (slots) => {
  return slots
    .map((slot) => {
      const start = new Date(`1970-01-01T${slot.start_time}`);
      const end = new Date(`1970-01-01T${slot.end_time}`);
      return `${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    })
    .join(", ");
};

export const groupSlotsByDay = (availability) => {
  if (!Array.isArray(availability)) {
    console.error("Availability is not an array:", availability);
    return {};
  }

  const grouped = {};
  availability.forEach((slot) => {
    if (!grouped[slot.office_name]) {
      grouped[slot.office_name] = {
        address: slot.office_address,
        days: {},
      };
    }
    if (!grouped[slot.office_name].days[slot.day]) {
      grouped[slot.office_name].days[slot.day] = [];
    }
    if (Array.isArray(slot.time_slots)) {
      grouped[slot.office_name].days[slot.day].push(...slot.time_slots);
    }
  });
  return grouped;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
