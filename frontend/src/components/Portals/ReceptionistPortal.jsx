import PortalConstants from "./PortalConstants.jsx";
import React from "react";
import MainFrame from "../Mainframe.jsx";

const ReceptionistPortal = ({ userFullName }) => {
  const sidebarItems = [
    ...PortalConstants.commonSidebarItems,
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

export default ReceptionistPortal;
