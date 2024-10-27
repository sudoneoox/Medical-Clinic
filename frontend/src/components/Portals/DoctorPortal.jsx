import React from "react";
import MainFrame from "../Mainframe.jsx";
import {
  CalendarDays,
  LogOut,
  Clock9,
  ChartNoAxesGantt,
  Settings,
  Users,
} from "lucide-react";

const DoctorPortal = ({ userFullName }) => {
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
    { label: "Patients", path: "/portal/patients", icon: <Users /> },
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
      userRole="Doctor"
      sidebarItems={sidebarItems}
    ></MainFrame>
  );
};

export default DoctorPortal;
