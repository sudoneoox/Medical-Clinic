import PortalConstants from "./PortalConstants.jsx";
import React from "react";
import MainFrame from "../Mainframe.jsx";

const DoctorPortal = ({ userFullName }) => {
  const sidebarItems = [
    ...PortalConstants.SidebarItems,
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

export default DoctorPortal;
