import PortCommImports from "./CommonImports.jsx";

const ReceptionistPortal = ({ userFullName }) => {
  const sidebarItems = [
    ...PortCommImports.commonSidebarItems,
    { label: "Appointments", path: "/appointments", icon: "" },
    { label: "Patient Records", path: "/records", icon: "" },
  ];

  return (
    <PortCommImports.MainFrame
      userFullName={userFullName}
      userRole="Receptionist"
      sidebarItems={sidebarItems}
    >
      <h1 className="text-2xl font-bold mb-4">Receptionist Dashboard</h1>
      {/* TODO: receptionist-specific components */}
    </PortCommImports.MainFrame>
  );
};

export default ReceptionistPortal;
