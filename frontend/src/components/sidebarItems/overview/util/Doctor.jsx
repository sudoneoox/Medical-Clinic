import DashboardCard from "../DashboardCard";
import AppointmentList from "../AppointmentList";
import { Clock, Calendar, User } from "lucide-react";
const Doctor = ({ data }) => {
  const fullName = localStorage.getItem("userFullName");
  const email = localStorage.getItem("userEmail");

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Doctor Info"
        icon={<User className="h-4 w-4 text-gray-500" />}
      >
        <div className="space-y-2">
          <p>Name: {fullName}</p>
          <p>Email: {data.doctorInfo.email}</p>
          <p>Experience: {data.doctorInfo.experience} years</p>
        </div>
      </DashboardCard>

      <DashboardCard
        title="Today's Appointments"
        icon={<Clock className="h-4 w-4 text-gray-500" />}
      >
        <AppointmentList appointments={data.todaysAppointments} />
      </DashboardCard>

      <DashboardCard
        title="Upcoming Appointments"
        icon={<Calendar className="h-4 w-4 text-gray-500" />}
      >
        <AppointmentList appointments={data.upcomingAppointments} />
      </DashboardCard>
    </div>
  );
};

export default Doctor;
