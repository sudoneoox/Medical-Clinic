import React, { useState, useEffect } from "react";
import api from "../../../../api.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../utils/Card.tsx";
import { ScrollArea } from "../../../../utils/ScrollArea.tsx";
import BillingForm from "./BillingForm";
import { Badge } from "../../../../utils/Badge.tsx";
import { format } from "date-fns";

const BillingView = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // Function to fetch nurse appointments
  const fetchNurseAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        "/users/portal/nurse/appointments/getUnpaidAppointments",
        {
          user_id: localStorage.getItem("userId"),
        },
      );
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments on component mount
  useEffect(() => {
    fetchNurseAppointments();
  }, []);

  // Function to handle billing submission
  const handleBillingSubmit = async (appointment, billingData) => {
    try {
      const res = await api.post("/users/portal/nurse/billing/create", {
        appointment_id: appointment.appointment_id,
        patientId: appointment.patient_id,
        billingData,
        userId: localStorage.getItem("userId"),
      });
      console.log("RECEPTIONIST TIED TO APPOINTMENT", res.data.handled_by);
      // Refresh appointments list
      await fetchNurseAppointments();
      setSelectedAppointmentId(null);
    } catch (error) {
      console.error("Error creating billing:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Pending Appointment Billing</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <span className="text-gray-500">Loading appointments...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.appointment_id}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {appointment.patient_fname}{" "}
                          {appointment.patient_lname}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {format(
                            new Date(appointment.appointment_datetime),
                            "PPp",
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          Service: {appointment.reason}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={
                            "text-red-600 font-bold uppercase tracking-wide"
                          }
                        >
                          {appointment.has_bill ? "Billed" : "Pending Billing"}
                        </Badge>
                        {!appointment.has_bill &&
                          selectedAppointmentId !==
                            appointment.appointment_id && (
                            <button
                              onClick={() =>
                                setSelectedAppointmentId(
                                  appointment.appointment_id,
                                )
                              }
                              className="px-3 py-1 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-sm shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                            >
                              Create Bill
                            </button>
                          )}
                      </div>
                    </div>

                    {/* Render BillingForm inline if this appointment is selected */}
                    {selectedAppointmentId === appointment.appointment_id && (
                      <div className="mt-4">
                        <BillingForm
                          appointment={appointment}
                          onSubmit={handleBillingSubmit}
                          onCancel={() => setSelectedAppointmentId(null)}
                        />
                      </div>
                    )}
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No billable appointments found
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingView;
