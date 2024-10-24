import PortCommImports from "./CommonImports.jsx";
const PatientPortal = ({ userFullName, dashboardData }) => {
  const sidebarItems = [
    {
      label: "Overview",
      path: "/portal/overview",
      icon: <PortCommImports.ChartNoAxesGantt />,
    },
    {
      label: "Calendar",
      path: "/portal/calendar",
      icon: <PortCommImports.CalendarDays />,
    },
    {
      label: "My Appointments",
      path: "/portal/my-appointments",
      backendRequest: "",
      icon: <PortCommImports.Clock9 />,
    },
    {
      label: "Medical Records",
      path: "/portal/medical-records",
      icon: <PortCommImports.ClipboardPlus />,
    },
    {
      section: "account",
      label: "Settings",
      path: "/portal/settings",
      icon: <PortCommImports.Settings />,
    },
    // FOR LOG OUT you could just clear JWT and send them back to /login
    { label: "Logout", path: "/login", icon: <PortCommImports.LogOut /> },
  ];

  return (
    <PortCommImports.MainFrame
      userFullName={userFullName}
      userRole="Patient"
      sidebarItems={sidebarItems}
    >
      {/* TODO: MAKE THIS CONDITINAL IE A CHECK FLAG TO CHANGE  */}
      <PortCommImports.Dashboard
        userData={{ user_role: "PATIENT" }}
        dashboardData={dashboardData}
      />
    </PortCommImports.MainFrame>
  );
};

export default PatientPortal;
