import React from "react";
import MainFrame from "../Mainframe.jsx";
import {
  CalendarDays,
  ClipboardPlus,
  LogOut,
  Clock9,
  ChartNoAxesGantt,
  Settings,
} from "lucide-react";

const PatientPortal = ({ userFullName }) => {
  const sidebarItems = [
    {
      label: "Overview",
      path: "/portal/overview",
      icon: <ChartNoAxesGantt />,
    },
    {
      label: "Calendar",
      path: "/portal/calendar",
      icon: <CalendarDays />,
    },
    {
      label: "My Appointments",
      path: "/portal/my-appointments",
      icon: <Clock9 />,
    },
    {
      label: "Medical Records",
      path: "/portal/medical-records",
      icon: <ClipboardPlus />,
    },
    {
      section: "account",
      label: "Settings",
      path: "/portal/settings",
      icon: <Settings />,
    },
    { label: "Logout", path: "/login", icon: <LogOut /> },
  ];

  return (
    <MainFrame
      userFullName={userFullName}
      userRole="Patient"
      sidebarItems={sidebarItems}
    ></MainFrame>
  );
};

export default PatientPortal;
