import React from "react";
import { Card, CardContent } from "../../../../utils/Card.tsx";
import { formatDate } from "../utils/timeFormatters.js";

const AppointmentCard = ({ appointment, type }) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">
              {type === "patient"
                ? `Dr. ${appointment.doctor?.doctor_fname} ${appointment.doctor?.doctor_lname}`
                : `${appointment.patient?.patient_fname} ${appointment.patient?.patient_lname}`}
            </h4>
            <p className="text-sm text-gray-600">
              {formatDate(appointment.appointment_datetime)}
            </p>
            <p className="text-sm text-gray-600">
              {appointment.office?.office_name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Duration: {appointment.duration}
            </p>
            <p className="text-sm text-gray-500 mt-2">{appointment.reason}</p>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                appointment.status === "CONFIRMED"
                  ? "bg-green-100 text-green-800"
                  : appointment.status === "PENDING_DOCTOR_APPROVAL"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {appointment.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
