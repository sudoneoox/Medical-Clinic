import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import "../styles/tailwindbase.css";

// https://fullcalendar.io/docs/react

// this function is to handle the ui of events a color scheming would be nice but
// we'd have to find a way to do that an not accidently overlap colors, as well as to not use duplicate colors for different doctors
// and to store the color value in the database or user local storage?
function eventContent(eventInfo) {
  return (
    <>
      <div className="" style={{ backgroundColor: "red" }}>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
        <p>hello world</p>
      </div>
    </>
  );
}

export default function Calendar() {
  // event handlers ...
  const calendarAPI = useRef(null);

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
    console.log(arg.curentEvents);
  };
  return (
    <FullCalendar
      // css styling to fit calendar view
      className="calendar"
      plugins={[dayGridPlugin, interactionPlugin, multiMonthPlugin]}
      initialView="dayGridMonth"
      // to change view were going to have to make a button on which if clicked use the calendarAPI.changeView('dayGridWeek') and switch to our configured view
      views={{
        multiMonthPlugin: {
          type: "multiMonth",
          duration: { months: 3 },
        },
        dayGridPlugin: {
          type: "dayGrid",
          duration: { days: 7 },
        },
      }}
      dateClick={handleDateClick} // event handlers
      eventContent={eventContent}
      // upcoming events !! handled by db api
      // maybe an array of objects ?? and we will parse it with a util file?
      events={[
        { title: "event 1", date: "2024-09-09" },
        { title: "event 2", date: "2024-09-10" },
      ]}
      ref={calendarAPI}
    />
  );
}
