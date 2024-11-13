import React, { useState, useEffect } from "react";
import api from "../../../../api.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../utils/Card.tsx";
import { ScrollArea } from "../../../../utils/ScrollArea.tsx";
import AppointmentCard from "./AppointmentCard.jsx";
import Error from "./Error.jsx";

const AppointmentView = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.post("/users/portal/nurse/appointments", {
        user_id: localStorage.getItem("userId"),
      });
      setAppointments(response.data.appointments);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await api.put(
        `/users/portal/nurse/appointments/${appointmentId}/status`,
        {
          status: newStatus,
          user_id: localStorage.getItem("userId"),
        },
      );
      await fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const handleAddNote = async (appointmentId, noteText) => {
    try {
      const response = await api.post(
        `/users/portal/nurse/appointments/${appointmentId}/notes`,
        {
          note_text: noteText,
          user_id: localStorage.getItem("userId"),
        },
      );

      // Update the appointments state with the new note
      setAppointments(
        appointments.map((apt) => {
          if (apt.appointment_id === appointmentId) {
            return {
              ...apt,
              notes: [...(apt.notes || []), response.data.note],
            };
          }
          return apt;
        }),
      );
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };
  const handleEditNote = async (noteId, newText) => {
    try {
      await api.put(`/users/portal/nurse/appointments/notes/${noteId}`, {
        note_text: newText,
        user_id: localStorage.getItem("userId"),
      });
      await fetchAppointments();
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };
  if (error) {
    return <Error error={error} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Loading appointments...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.appointment_id}
                  appointment={appointment}
                  onStatusUpdate={handleStatusUpdate}
                  onAddNote={handleAddNote}
                  onEditNote={handleEditNote}
                />
              ))}
              {appointments.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No appointments found
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
export default AppointmentView;
