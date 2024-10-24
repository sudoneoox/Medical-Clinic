import React from "react";
import MainFrame from "./Mainframe";
import {
  CalendarDays,
  ClipboardPlus,
  LogOut,
  Clock9,
  ChartNoAxesGantt,
  Settings,
  UserSearch,
} from "lucide-react";
import Dashboard from "./DashboardCard.jsx";

// TODO: create all of these different links and each of these links make them pass to
// the backend the user id to get their respective data tied to the user

// TODO: use react library for the icons

// NOTE: for the 'provider' users were going to need a data entry
// form component for all of them

const commonSidebarItems = [
  { label: "Overview", path: "/portal/overview", icon: "" },
  { label: "Calendar", path: "/portal/calendar", icon: "" },
  { label: "Settings", path: "/portal/settings", icon: "⚙️" },
  { label: "Logout", path: "/portal/logout", icon: "" },
];

export const PatientPortal = ({ userFullName, dashboardData }) => {
  const sidebarItems = [
    { label: "Overview", path: "/portal/overview", icon: <ChartNoAxesGantt /> },
    { label: "Calendar", path: "/portal/calendar", icon: <CalendarDays /> },
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
    // FOR LOG OUT you could just clear JWT and send them back to /login
    { label: "Logout", path: "/login", icon: <LogOut /> },
  ];

  console.log("patient dashboardData", dashboardData);
  return (
    <MainFrame
      userFullName={userFullName}
      userRole="Patient"
      sidebarItems={sidebarItems}
    >
      <Dashboard
        userData={{ user_role: "PATIENT" }}
        dashboardData={dashboardData}
      />
    </MainFrame>
  );
};

export const DoctorPortal = ({ userFullName, dashboardData }) => {
  // const sidebarItems = [
  //   ...commonSidebarItems,
  //   { label: "Patients", path: "/patients", icon: "" },
  //   { label: "Prescriptions", path: "/prescriptions", icon: "" },
  // ];
  const sidebarItems = [
    { label: "Overview", path: "/portal/overview", icon: <ChartNoAxesGantt /> },
    { label: "Calendar", path: "/portal/calendar", icon: <CalendarDays /> },
    {
      label: "My Appointments",
      path: "/portal/my-appointments",
      icon: <Clock9 />,
    },
    {
      label: "Patients",
      path: "/portal/patients",
      icon: <UserSearch />,
    },
    {
      label: "Prescriptions",
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
      userRole="Doctor"
      sidebarItems={sidebarItems}
    >
      {/* TODO: doctor-specific components */}
      <Dashboard
        userData={{ user_role: "DOCTOR" }}
        dashboardData={dashboardData}
      />
    </MainFrame>
  );
};

export const NursePortal = ({ userFullName }) => {
  const sidebarItems = [
    ...commonSidebarItems,
    { label: "Patient Care", path: "/patient-care", icon: "" },
    { label: "Medications", path: "/medications", icon: "" },
  ];

  return (
    <MainFrame
      userFullName={userFullName}
      userRole="Nurse"
      sidebarItems={sidebarItems}
    >
      <h1 className="text-2xl font-bold mb-4">Nurse Dashboard</h1>
      {/* TODO: nurse-specific components */}
    </MainFrame>
  );
};

export const ReceptionistPortal = ({ userFullName }) => {
  const sidebarItems = [
    ...commonSidebarItems,
    { label: "Appointments", path: "/appointments", icon: "" },
    { label: "Patient Records", path: "/records", icon: "" },
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


// TODO: also create admin entity and etc
export const AdminPortal = ({ userFullName }) => {
  const sidebarItems = [
    ...commonSidebarItems,
    { label: "User Management", path: "/users", icon: "" },
    { label: "Analytics", path: "/analytics", icon: "" },
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
