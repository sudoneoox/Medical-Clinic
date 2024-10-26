import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../utils/Card.tsx";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "../utils/Button.tsx";
import "../styles/tailwindbase.css";

// TODO: need to set backend api for calendar
// TODO: need calendar to handle different types of data not just data?.appointments
const Calendar = ({ data }) => {
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (data?.appointments) {
      // DESC:  transforms appointments into calendar events
      const calendarEvents = data.appointments.map((apt) => ({
        id: apt.appointment_id,
        title: apt.title || "Appointment",
        start: apt.appointment_datetime,
        end: apt.end_datetime,
        extendedProps: {
          doctor: apt.doctor_name,
          patient: apt.patient_name,
          status: apt.status,
          type: apt.appointment_type,
        },
      }));
      setEvents(calendarEvents);
    }
  }, [data]);

  const eventContent = (eventInfo) => {
    const { event } = eventInfo;
    const props = event.extendedProps;

    return (
      <div className="p-1 overflow-hidden text-xs">
        <div className="font-semibold truncate">{event.title}</div>
        {userRole === "DOCTOR" && (
          <div className="truncate text-gray-600">Patient: {props.patient}</div>
        )}
        {userRole === "PATIENT" && (
          <div className="truncate text-gray-600">Dr. {props.doctor}</div>
        )}
        {(userRole === "NURSE" || userRole === "RECEPTIONIST") && (
          <>
            <div className="truncate text-gray-600">Dr. {props.doctor}</div>
            <div className="truncate text-gray-600">
              Patient: {props.patient}
            </div>
          </>
        )}
      </div>
    );
  };

  const handleDateClick = (arg) => {
    // NOTE: userRole switching
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
            eventContent={eventContent}
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
