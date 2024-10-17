import React from "react";
import MainFrame from "./Mainframe";
import {
  CalendarDays,
  ClipboardPlus,
  LogOut,
  Clock9,
  ChartNoAxesGantt,
  Settings,
} from "lucide-react";
// TODO: create all of these different links and each of these links make them pass to
// the backend the user id to get their respective data tied to the user

// TODO: use react library for the icons

// NOTE: for the 'provider' users were going to need a data entry
// form component for all of them

const commonSidebarItems = [
  { label: "Overview", path: "/overview", icon: "" },
  { label: "Calendar", path: "/calendar", icon: "" },
  { label: "Settings", path: "/settings", icon: "⚙️" },
  { label: "Logout", path: "/logout", icon: "" },
];

export const DoctorPortal = ({ userFullName }) => {
  const sidebarItems = [
    ...commonSidebarItems,
    { label: "Patients", path: "/patients", icon: "" },
    { label: "Prescriptions", path: "/prescriptions", icon: "" },
  ];

  return (
    <MainFrame
      userFullName={userFullName}
      userRole="Doctor"
      sidebarItems={sidebarItems}
    >
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
      {/* TODO: doctor-specific components */}
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
export const PatientPortal = ({ userFullName }) => {
  const sidebarItems = [
    { label: "Overview", path: "/overview", icon: <ChartNoAxesGantt /> },
    { label: "Calendar", path: "/calendar", icon: <CalendarDays /> },
    {
      label: "My Appointments",
      path: "/my-appointments",
      icon: <Clock9 />,
    },
    {
      label: "Medical Records",
      path: "/medical-records",
      icon: <ClipboardPlus />,
    },
    {
      section: "account",
      label: "Settings",
      path: "/settings",
      icon: <Settings />,
    },
    { label: "Logout", path: "/logout", icon: <LogOut /> },
  ];

  return (
    <MainFrame
      userFullName={userFullName}
      userRole="Patient"
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Patient Dashboard</h2>
        {/* TODO: patient-specific components */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Upcoming Appointments
            </h3>
            {/* TODO: appointments list component */}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Recent Medical Records
            </h3>
            {/* TODO: medical records summary component */}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Health Metrics</h3>
          {/* TODO: health metrics chart component */}
        </div>
      </div>
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
