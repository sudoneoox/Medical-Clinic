import React, { useRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "../../../utils/Button.tsx";
import { Card, CardContent } from "../../../utils/Card.tsx";
import "../../../styles/tailwindbase.css";

import { handleDateClick } from "./Handlers.jsx";
import EventContent from "./EventContent.jsx";

const Calendar = ({ data }) => {
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (data?.appointments) {
      const calendarEvents = data.appointments.map((evt) => {
        // Check if this is a schedule event or appointment event
        if (evt.extendedProps?.type === "schedule") {
          // Handle schedule events (already formatted from backend)
          return {
            id: evt.id,
            title: evt.title,
            start: evt.start,
            end: evt.end,
            backgroundColor: evt.backgroundColor || "#059669",
            extendedProps: evt.extendedProps,
          };
        } else {
          // Handle appointment events (traditional format)
          const startHour = new Date(
            evt.appointment_datetime,
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          // Only process duration if it exists
          let endHour = startHour;
          if (evt.duration) {
            const [hours, minutes, seconds] = evt.duration
              .split(":")
              .map(Number);
            const durationMs =
              (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
            endHour = new Date(
              new Date(evt.appointment_datetime).getTime() + durationMs,
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          }

          return {
            id: evt.appointment_id,
            title: `Appointment`,
            start: evt.appointment_datetime,
            end: evt.appointment_datetime,
            backgroundColor: "#4F46E5",
            extendedProps: {
              type: "appointment",
              duration: `(${startHour} - ${endHour})`,
              doctor: evt.doctor?.doctor_lname,
              patient: evt.patient_name,
              status: evt.status,
              reason: evt.reason,
              location: evt.Office?.office_name,
            },
          };
        }
      });
      setEvents(calendarEvents);
    }
  }, [data]);

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          {userRole.charAt(0) + userRole.slice(1).toLowerCase()} Calendar
        </h1>
        {userRole === "RECEPTIONIST" && (
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> New Appointment
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {renderHeader()}
      <Card>
        <CardContent className="p-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin, multiMonthPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            views={{
              dayGridMonth: {
                titleFormat: { year: "numeric", month: "long" },
              },
              dayGridWeek: {
                titleFormat: { year: "numeric", month: "long", day: "numeric" },
              },
            }}
            height="auto"
            dateClick={handleDateClick}
            eventContent={EventContent}
            events={events}
            eventClassNames="rounded-md shadow-sm"
            dayCellClassNames="hover:bg-gray-50 cursor-pointer"
            dayHeaderClassNames="text-sm font-semibold text-gray-600"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
