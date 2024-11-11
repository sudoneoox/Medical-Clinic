import React from "react";
import { format } from "date-fns";
import { Badge } from "../../../../utils/Badge.tsx";

const AppointmentList = ({ appointments }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.appointment_id}
          className="p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {appointment.patient_fname} {appointment.patient_lname}
              </h3>
              <p className="text-sm text-gray-500">
                {format(new Date(appointment.appointment_datetime), "PPp")}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {appointment.duration}
              </p>
              <p className="text-sm text-gray-500">
                Office: {appointment.office_name}
              </p>
              {appointment.reason && (
                <p className="text-sm text-gray-600 mt-2">
                  Reason: {appointment.reason}
                </p>
              )}
            </div>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status}
            </Badge>
          </div>
        </div>
      ))}
      {appointments.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No appointments found
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
