const EventContent = (eventInfo) => {
  const { event } = eventInfo;
  const props = event.extendedProps;
  const userRole = localStorage.getItem("userRole");

  if (props.type === "schedule") {
    return (
      <div className="p-1 overflow-hidden text-xs">
        <div className="font-semibold truncate">
          {props.isPrimary ? "🏥 Primary Office" : "🏥 Office Hours"}
        </div>
        <div className="truncate text-gray-600">{props.location}</div>
        <div className="truncate text-gray-600">
          {new Date(event.start).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -
          {new Date(event.end).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    );
  }

  // Default appointment display
  return (
    <div className="p-1 overflow-hidden text-xs">
      <div className="font-semibold truncate">{event.title}</div>
      {userRole === "DOCTOR" && (
        <div className="truncate text-gray-600">Patient: {props.patient}</div>
      )}
      {userRole === "PATIENT" && (
        <>
          <div className="truncate text-gray-600">{props.duration}</div>
          <div className="truncate text-gray-600">Dr. {props.doctor}</div>
        </>
      )}
      {(userRole === "NURSE" || userRole === "RECEPTIONIST") && (
        <>
          <div className="truncate text-gray-600">Dr. {props.doctor}</div>
          <div className="truncate text-gray-600">Patient: {props.patient}</div>
        </>
      )}
      {props.location && (
        <div className="truncate text-gray-600">At: {props.location}</div>
      )}
    </div>
  );
};
export default EventContent;
