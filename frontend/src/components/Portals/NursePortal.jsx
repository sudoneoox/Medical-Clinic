import React from "react";
import Mainframe from "../Mainframe.jsx";
import PortalConstants from "./PortalConstants.jsx";

const NursePortal = ({ userFullName }) => {
  const sidebarItems = [
    ...PortalConstants.SidebarItems,
    { label: "Patient Care", path: "/patient-care", icon: "" },
    { label: "Medications", path: "/medications", icon: "" },
  ];

  return (
    <Mainframe
      userFullName={userFullName}
      userRole="Nurse"
      sidebarItems={sidebarItems}
    >
      <h1 className="text-2xl font-bold mb-4">Nurse Dashboard</h1>
      {/* TODO: nurse-specific components */}
    </Mainframe>
  );
};

export default NursePortal;
