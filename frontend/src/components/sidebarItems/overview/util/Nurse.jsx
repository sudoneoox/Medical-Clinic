import DashboardCard from "../DashboardCard";
import AppointmentList from "../AppointmentList";
import { User, Activity } from "lucide-react";
const Nurse = ({ data }) => {
  const fullName = localStorage.getItem("userFullName");
  const email = localStorage.getItem("userEmail");
  console.log(data);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Nurse Info"
        icon={<User className="h-4 w-4 text-gray-500" />}
      >
        <div className="space-y-2">
          <p>Name: {fullName}</p>
          <p>Email: {data.nurseInfo.email}</p>
          <p>Specialization: {data.nurseInfo.specialization}</p>
        </div>
      </DashboardCard>

      {/* <DashboardCard */}
      {/*   title="Today's Assignments" */}
      {/*   icon={<Activity className="h-4 w-4 text-gray-500" />} */}
      {/* > */}
      {/*   <AppointmentList */}
      {/*     appointments={data.appointments.filter( */}
      {/*       (apt) => */}
      {/*         new Date(apt.appointment_datetime).toDateString() === */}
      {/*         new Date().toDateString(), */}
      {/*     )} */}
      {/*   /> */}
      {/* </DashboardCard> */}
    </div>
  );
};

export default Nurse;
