import React from "react";
import "../styles/tailwindbase.css";
import { Navigate, useLoaderData } from "react-router-dom";
import AdminPortal from "../components/Portals/AdminPortal.jsx";
import NursePortal from "../components/Portals/NursePortal.jsx";
import ReceptionistPortal from "../components/Portals/ReceptionistPortal.jsx";
import DoctorPortal from "../components/Portals/DoctorPortal.jsx";
import PatientPortal from "../components/Portals/PatientPortal.jsx";

//INFO: basically this function is what decides what portal is rendered after
// the user logs in backend logic for this is in index.jsx root dir
export default function Portal() {
  const { dashboardData } = useLoaderData();
  const userRole = localStorage.getItem("userRole");
  const userFullName = localStorage.getItem("userFullName");

  if (!userRole || !userFullName) {
    return <Navigate to="/login" replace />;
  }

  let PortalComponent;
  switch (userRole) {
    case "DOCTOR":
      PortalComponent = DoctorPortal;
      break;
    case "NURSE":
      PortalComponent = NursePortal;
      break;
    case "RECEPTIONIST":
      PortalComponent = ReceptionistPortal;
      break;
    case "PATIENT":
      PortalComponent = PatientPortal;
      break;
    case "ADMIN":
      PortalComponent = AdminPortal;
      break;
    default:
      return <Navigate to="/login" replace />;
  }

  return (
    <PortalComponent
      userFullName={userFullName}
      dashboardData={dashboardData}
    />
  );
}
