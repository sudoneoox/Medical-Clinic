import React from "react";
import MainFrame from "../Mainframe.jsx";
//INFO: ICON REACT LIBRARY
import {
  CalendarDays,
  ClipboardPlus,
  LogOut,
  Clock9,
  ChartNoAxesGantt,
  Settings,
} from "lucide-react";
import Dashboard from "../../components/DashboardCard.jsx";

const SidebarItems = [
  { label: "Overview", path: "/portal/overview", icon: "" },
  { label: "Calendar", path: "/portal/calendar", icon: "" },
  { label: "Settings", path: "/portal/settings", icon: "⚙️" },
  { label: "Logout", path: "/portal/logout", icon: "" },
];

const PortCommImports = {
  Dashboard,
  SidebarItems,
  CalendarDays,
  ClipboardPlus,
  LogOut,
  Clock9,
  ChartNoAxesGantt,
  Settings,
};

export default PortCommImports;
