import React from "react";
import "../styles/tailwindbase.css";
import { Navigate, useLoaderData } from "react-router-dom";
import {
  DoctorPortal,
  NursePortal,
  ReceptionistPortal,
  PatientPortal,
  AdminPortal,
} from "../components/PortalComponents";

// this function will be used to render the components inside the mainframe portal page based on the user type
// i.e. users will have different views/privalages compared to the admin which will have a db web portal

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
