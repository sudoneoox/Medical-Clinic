import React from "react";
import MainFrame from "../Mainframe.jsx";
import {
  LogOut,
  ChartNoAxesGantt,
  Settings,
  ChartPie,
  UserRoundPen,
} from "lucide-react";
// TODO: also create admin entity and etc
const AdminPortal = ({ userFullName }) => {
  const sidebarItems = [
    {
      label: "Overview",
      path: "/portal/overview",
      icon: <ChartNoAxesGantt />,
    },

    { label: "User Management", path: "/users", icon: <UserRoundPen /> },
    { label: "Analytics", path: "/analytics", icon: <ChartPie /> },
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
      userRole="Admin"
      sidebarItems={sidebarItems}
    >
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {/* TODO: admin-specific components */}
    </MainFrame>
  );
};

export default AdminPortal;
