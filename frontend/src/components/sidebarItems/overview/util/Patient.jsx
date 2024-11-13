import DashboardCard from "../DashboardCard";
import AppointmentList from "../AppointmentList";
import MedicalRecordList from "../MedicalRecordList";
import { User, Calendar, FileText } from "lucide-react";

const Patient = ({ data }) => {
  const fullName = localStorage.getItem("userFullName");
  const email = localStorage.getItem("userEmail");

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Personal Info"
        icon={<User className="h-4 w-4 text-gray-500" />}
      >
        <div className="space-y-2">
          <p>Name: {fullName}</p>
          <p>Email: {data.patientInfo.email}</p>
          <p>Phone: {data.patientInfo.phone}</p>
        </div>
      </DashboardCard>

      <DashboardCard
        title="Upcoming Appointments"
        icon={<Calendar className="h-4 w-4 text-gray-500" />}
      >
        <AppointmentList appointments={data.appointments} />
      </DashboardCard>

      <DashboardCard
        title="Recent Medical Records"
        icon={<FileText className="h-4 w-4 text-gray-500" />}
      >
        <MedicalRecordList records={data.medicalRecords} />
      </DashboardCard>
    </div>
  );
};

export default Patient;
