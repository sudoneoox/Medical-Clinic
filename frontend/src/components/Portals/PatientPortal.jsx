import React from "react";
import MainFrame from "../Mainframe.jsx";
import Overview from "../DashboardCard.jsx";
import {
  CalendarDays,
  ClipboardPlus,
  LogOut,
  Clock9,
  ChartNoAxesGantt,
  Settings,
} from "lucide-react";

const PatientPortal = ({ userFullName, dashboardData }) => {
  console.log(userFullName, dashboardData);
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
      backendRequest: "",
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
    // FOR LOG OUT you could just clear JWT and send them back to /login
    { label: "Logout", path: "/login", icon: <LogOut /> },
  ];

  return (
    <MainFrame
      userFullName={userFullName}
      userRole="Patient"
      sidebarItems={sidebarItems}
    >
      <Overview
        userData={{ user_role: "PATIENT" }}
        dashboardData={dashboardData}
      />
    </MainFrame>
  );
};

export default PatientPortal;
