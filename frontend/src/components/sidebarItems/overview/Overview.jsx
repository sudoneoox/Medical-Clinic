import React from "react";
import renderDashboard from "./util/RenderDashboard.jsx";

const Overview = ({ data }) => {
  const userData = {
    user_role: localStorage.getItem("userRole"),
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {userData.user_role.charAt(0) +
          userData.user_role.slice(1).toLowerCase()}{" "}
        Dashboard
      </h1>
      {renderDashboard({ data })}
    </div>
  );
};

export default Overview;
