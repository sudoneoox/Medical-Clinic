import DashboardCard from "../DashboardCard.jsx";
import { Alert, AlertDescription } from "../../../../utils/Alerts.tsx";
import Nurse from "./Nurse.jsx";
import Receptionist from "./Receptionist.jsx";
import Doctor from "./Doctor.jsx";
import Patient from "./Patient.jsx";
import Admin from "./Admin.jsx";

const renderDashboard = ({ data }) => {
  const userData = {
    user_role: localStorage.getItem("userRole"),
  };

  switch (userData.user_role) {
    case "PATIENT":
      return <Patient data={data} />;

    case "DOCTOR":
      return <Doctor data={data} />;
    case "NURSE":
      return <Nurse data={data} />;

    case "RECEPTIONIST":
      return <Receptionist data={data} />;
    case "ADMIN":
      return <Admin data={data} />;
    default:
      return (
        <Alert>
          <AlertDescription>Unknown user role</AlertDescription>
        </Alert>
      );
  }
};

export default renderDashboard;
