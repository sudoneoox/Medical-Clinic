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

    { label: "Analytics", path: "/portal/analytics", icon: <ChartPie /> },
    { label: "User Management", path: "/portal/users", icon: <UserRoundPen /> },
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
