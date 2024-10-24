import PortCommImports from "./CommonImports.jsx";

const NursePortal = ({ userFullName }) => {
  const sidebarItems = [
    ...PortCommImports.commonSidebarItems,
    { label: "Patient Care", path: "/patient-care", icon: "" },
    { label: "Medications", path: "/medications", icon: "" },
  ];

  return (
    <PortCommImports.Mainframe
      userFullName={userFullName}
      userRole="Nurse"
      sidebarItems={sidebarItems}
    >
      <h1 className="text-2xl font-bold mb-4">Nurse Dashboard</h1>
      {/* TODO: nurse-specific components */}
    </PortCommImports.Mainframe>
  );
};

export default NursePortal;
