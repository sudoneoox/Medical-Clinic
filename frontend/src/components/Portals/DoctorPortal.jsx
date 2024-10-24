import PortCommImports from "./CommonImports.jsx";

const DoctorPortal = ({ userFullName }) => {
  const sidebarItems = [
    ...PortCommImports.commonSidebarItems,
    { label: "Patients", path: "/patients", icon: "" },
    { label: "Prescriptions", path: "/prescriptions", icon: "" },
  ];

  return (
    <PortCommImports.MainFrame
      userFullName={userFullName}
      userRole="Doctor"
      sidebarItems={sidebarItems}
    >
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
      {/* TODO: doctor-specific components */}
    </PortCommImports.MainFrame>
  );
};

export default DoctorPortal;
