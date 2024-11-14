import DashboardCard from "../DashboardCard";
import AppointmentList from "../AppointmentList";
import { User, Hospital, AlertCircle } from "lucide-react";

const Receptionist = ({ data }) => {
  const fullName = localStorage.getItem("userFullName");
  const email = localStorage.getItem("userEmail");

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Receptionist Info"
        icon={<User className="h-4 w-4 text-gray-500" />}
      >
        <div className="space-y-2">
          <p>Name: {fullName}</p>
          <p>Email: {data.receptionistInfo.email}</p>
        </div>
      </DashboardCard>

      {/* <DashboardCard */}
      {/*   title="Today's Appointments" */}
      {/*   icon={<Hospital className="h-4 w-4 text-gray-500" />} */}
      {/* > */}
      {/*   <AppointmentList */}
      {/*     appointments={data.appointments.filter( */}
      {/*       (apt) => */}
      {/*         new Date(apt.appointment_datetime).toDateString() === */}
      {/*         new Date().toDateString(), */}
      {/*     )} */}
      {/*   /> */}
      {/* </DashboardCard> */}
      {/**/}
      {/* <DashboardCard */}
      {/*   title="Pending Appointments" */}
      {/*   icon={<AlertCircle className="h-4 w-4 text-gray-500" />} */}
      {/* > */}
      {/*   <AppointmentList */}
      {/*     appointments={data.appointments.filter( */}
      {/*       (apt) => new Date(apt.appointment_datetime) > new Date(), */}
      {/*     )} */}
      {/*   /> */}
      {/* </DashboardCard> */}
    </div>
  );
};

export default Receptionist;
