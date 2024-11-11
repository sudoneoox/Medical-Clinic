export const handleDateClick = (arg) => {
  // NOTE: userRole switching
  // WARNING: not yet implemented
  const userRole = localStorage.getItem("userRole");

  switch (userRole) {
    case "RECEPTIONIST":
      // Open appointment creation modal
      console.log("Receptionist creating appointment for:", arg.dateStr);
      break;
    case "DOCTOR":
      // Show schedule for the day
      console.log("Doctor viewing schedule for:", arg.dateStr);
      break;
    case "PATIENT":
      // Show available slots for booking appointments
      console.log("Patient viewing available slots for:", arg.dateStr);
      break;
    case "NURSE":
      // View TODO for the day // same as RECEPTIONIST ?
      console.log("Nurse clicked calender for::", arg.dateStr);
      break;
    case "ADMIN":
      // ?? Will they even get a calendar
      console.log("User Admin yet implemented");
      break;
    default:
      console.log("NOT A USER");
      break;
  }
};
