import React from "react";
import Mainframe from "../Mainframe.jsx";
import PortalConstants from "./PortalConstants.jsx";
import {
  LogOut,
  ChartNoAxesGantt,
  Settings,
  CalendarDays,
  PillBottle,
  UserRoundCheck,
} from "lucide-react";

const NursePortal = ({ userFullName }) => {
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

    { label: "Patient Care", path: "/patient-care", icon: <UserRoundCheck /> },
    { label: "Medications", path: "/medications", icon: <PillBottle /> },
    {
      section: "account",
      label: "Settings",
      path: "/portal/settings",
      icon: <Settings />,
    },
    { label: "Logout", path: "/login", icon: <LogOut /> },
  ];

  return (
    <Mainframe
      userFullName={userFullName}
      userRole="Nurse"
      sidebarItems={sidebarItems}
    >
      <h1 className="text-2xl font-bold mb-4">Nurse Dashboard</h1>
      {/* TODO: nurse-specific components */}
    </Mainframe>
  );
};

export default NursePortal;
