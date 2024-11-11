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
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // TODO: finish backend controller should fetch appointments tied to the nurse
  useEffect(() => {
    const fetchNurseAppointments = async () => {
      try {
        const response = await api.post(
          "/users/portal/nurse/appointments/billable",
          {
            nurse_id: localStorage.getItem("nurseId"),
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

    fetchNurseAppointments();
  }, []);

  // TODO: creates bill tied to that appointment
  const handleBillingSubmit = async (appointmentId, billingData) => {
    try {
      await api.post("/users/portal/nurse/billing/create", {
        nurse_id: localStorage.getItem("nurseId"),
        appointment_id: appointmentId,
        ...billingData,
      });

      // Refresh appointments list
      setAppointments(
        appointments.map((apt) =>
          apt.appointment_id === appointmentId
            ? { ...apt, has_billing: true }
            : apt,
        ),
      );
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error creating billing:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Billing</CardTitle>
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
                            appointment.has_billing
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {appointment.has_billing
                            ? "Billed"
                            : "Pending Billing"}
                        </Badge>
                        {!appointment.has_billing && (
                          <button
                            onClick={() => setSelectedAppointment(appointment)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Create Bill
                          </button>
                        )}
                      </div>
                    </div>
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

      {selectedAppointment && (
        <BillingForm
          appointment={selectedAppointment}
          onSubmit={handleBillingSubmit}
          onCancel={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

export default BillingView;
