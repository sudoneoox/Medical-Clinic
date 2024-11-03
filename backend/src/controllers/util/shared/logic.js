// Helper function to convert HH:MM:SS to milliseconds
const timeToMs = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
};

// Helper function to get dates for next 3 months for a given day of week
const getNextThreeMonthsDates = (dayOfWeek) => {
  const dates = [];
  const today = new Date();
  const threeMonthsFromNow = new Date(today);
  threeMonthsFromNow.setMonth(today.getMonth() + 3);

  const dayMap = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0,
  };

  let current = new Date(today);
  current.setDate(
    current.getDate() + ((dayMap[dayOfWeek] - current.getDay() + 7) % 7),
  );

  while (current <= threeMonthsFromNow) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  return dates;
};

// Helper function to combine date and time
const combineDateTime = (date, time) => {
  const [hours, minutes, seconds] = time.split(":");
  const combined = new Date(date);
  combined.setHours(hours, minutes, seconds);
  return combined;
};

const logic = {
  timeToMs,
  getNextThreeMonthsDates,
  combineDateTime,
};

export default logic;
