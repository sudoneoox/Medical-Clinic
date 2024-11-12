import PortalConstants from "./PortalConstants.jsx";
import React from "react";
import MainFrame from "../Mainframe.jsx";
import {
  UserSearch,
  LogOut,
  Clock9,
  ChartNoAxesGantt,
  Settings,
  CalendarDays,
} from "lucide-react";
const ReceptionistPortal = ({ userFullName }) => {
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

    { label: "Appointments", path: "/portal/appointments", icon: <Clock9 /> },
    { label: "Patient Records", path: "/records", icon: <UserSearch /> },
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
      userRole="Receptionist"
      sidebarItems={sidebarItems}
    >
      <h1 className="text-2xl font-bold mb-4">Receptionist Dashboard</h1>
      {/* TODO: receptionist-specific components */}
    </MainFrame>
  );
};

export default ReceptionistPortal;
