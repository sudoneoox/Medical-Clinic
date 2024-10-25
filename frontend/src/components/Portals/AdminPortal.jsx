import React from "react";
import PortalConstants from "./PortalConstants.jsx";
import MainFrame from "../Mainframe.jsx";

// TODO: also create admin entity and etc
const AdminPortal = ({ userFullName }) => {
  const sidebarItems = [
    ...PortalConstants.commonSidebarItems,
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

export default AdminPortal;
