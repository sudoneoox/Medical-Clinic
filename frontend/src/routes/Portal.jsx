import React, {useState} from "react";
import "../styles/tailwindbase.css";
import { useLocation, Navigate } from "react-router-dom";
import {
  DoctorPortal,
  NursePortal,
  ReceptionistPortal,
  PatientPortal,
  AdminPortal,
} from "../components/PortalComponents";

import api from '../api.js'


// this function will be used to render the components inside the mainframe portal page based on the user type
// i.e. users will have different views/privalages compared to the admin which will have a db web portal
export default function Portal() {
  const location = useLocation();
  const userRole = location.state?.userRole || localStorage.getItem("userRole"); // change with handling logic provided by the user login db api
  const userFullName = location.state?.userFullName || "User";
  const [error, setError] = useState('');


  const setupDashboard = async (err) => {
    try {
      const response = await api.post(
        "http://localhost:5000/api/users/dashboard",
        userRole,
      );
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message || "failed to retrieve dashboard data",
        );
      } else if (err.request) {
        setError("No response received from server. Please try again later.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }

  }


  // TODO : might have to use useLoader here to fetch get data to populate for the userDashboard

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

  return <PortalComponent userFullName={userFullName} />;
}
