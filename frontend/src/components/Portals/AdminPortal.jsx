import PortCommImports from "./CommonImports.jsx";

// TODO: also create admin entity and etc
const AdminPortal = ({ userFullName }) => {
  const sidebarItems = [
    ...PortCommImports.commonSidebarItems,
    { label: "User Management", path: "/users", icon: "" },
    { label: "Analytics", path: "/analytics", icon: "" },
  ];

  return (
    <PortCommImports.MainFrame
      userFullName={userFullName}
      userRole="Admin"
      sidebarItems={sidebarItems}
    >
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {/* TODO: admin-specific components */}
    </PortCommImports.MainFrame>
  );
};

export default AdminPortal;
