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
  const grouped = {};
  availability.forEach((slot) => {
    if (!grouped[slot.office_name]) {
      grouped[slot.office_name] = {
        address: slot.office_address,
        days: {},
      };
    }
    grouped[slot.office_name].days[slot.day] = slot.time_slots;
  });
  return grouped;
};

export const getDayOfWeek = (date) => {
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  return days[date.getDay()];
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
