import React, { useState, useEffect } from "react";
import api from "../../../../api.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../utils/Card.tsx";
import { ScrollArea } from "../../../../utils/ScrollArea.tsx";
import AppointmentList from "./AppointmentList";

const AppointmentView = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // TODO: set up backend gets appointments tied to nurse
        const response = await api.post("/users/portal/nurse/appointments", {
          user_id: localStorage.getItem("userId"),
          nurse_id: localStorage.getItem("nurseId"),
        });
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <span className="text-gray-500">Loading appointments...</span>
            </div>
          ) : (
            <AppointmentList appointments={appointments} />
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AppointmentView;
