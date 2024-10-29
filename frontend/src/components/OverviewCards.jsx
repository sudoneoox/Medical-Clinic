import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../utils/Card.tsx";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Activity,
  Hospital,
  AlertCircle,
  LayoutDashboard,
  Shield,
} from "lucide-react";

import { Alert, AlertDescription } from "../utils/Alerts.tsx";

const DashboardCard = ({ title, icon, children }) => (
  <Card className="w-full">
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const AppointmentList = ({ appointments = [] }) => (
  <div className="space-y-4">
    {appointments.length === 0 ? (
      <p>No appointments found.</p>
    ) : (
      appointments.map((apt, i) => (
        <div key={i} className="flex items-start justify-between border-b pb-2">
          <div>
            <p className="font-medium">
              {apt.patient?.patient_fname} {apt.patient?.patient_lname}
              {apt.doctor?.doctor_fname} {apt.doctor?.doctor_lname}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(apt.appointment_datetime).toLocaleString()}
            </p>
          </div>
          <div className="text-sm">
            <p>{apt.office?.office_name}</p>
          </div>
        </div>
      ))
    )}
  </div>
);

const MedicalRecordList = ({ records }) => (
  <div className="space-y-4">
    {records.map((record, i) => (
      <div key={i} className="flex items-center justify-between border-b pb-2">
        <div>
          <p className="font-medium">{record.diagnosis}</p>
          <p className="text-sm text-gray-500">
            Dr. {record.doctor?.doctor_fname} {record.doctor?.doctor_lname}
          </p>
        </div>
        <div className="text-sm">
          {new Date(record.created_at).toLocaleDateString()}
        </div>
      </div>
    ))}
  </div>
);

const Overview = ({ data }) => {
  const userData = {
    user_role: localStorage.getItem("userRole"),
  };
  console.log(data);
  const fullName = localStorage.getItem("userFullName");

  const renderDashboard = () => {
    switch (userData.user_role) {
      case "PATIENT":
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

      case "DOCTOR":
        console.log(data);
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
      case "NURSE":
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

            <DashboardCard
              title="Today's Assignments"
              icon={<Activity className="h-4 w-4 text-gray-500" />}
            >
              <AppointmentList
                appointments={data.appointments.filter(
                  (apt) =>
                    new Date(apt.appointment_datetime).toDateString() ===
                    new Date().toDateString(),
                )}
              />
            </DashboardCard>
          </div>
        );

      case "RECEPTIONIST":
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

            <DashboardCard
              title="Today's Appointments"
              icon={<Hospital className="h-4 w-4 text-gray-500" />}
            >
              <AppointmentList
                appointments={data.appointments.filter(
                  (apt) =>
                    new Date(apt.appointment_datetime).toDateString() ===
                    new Date().toDateString(),
                )}
              />
            </DashboardCard>

            <DashboardCard
              title="Pending Appointments"
              icon={<AlertCircle className="h-4 w-4 text-gray-500" />}
            >
              <AppointmentList
                appointments={data.appointments.filter(
                  (apt) => new Date(apt.appointment_datetime) > new Date(),
                )}
              />
            </DashboardCard>
          </div>
        );
      case "ADMIN":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Admin Info"
              icon={<Shield className="h-4 w-4 text-gray-500" />}
            >
              <div className="space-y-2">
                <p>Name: {fullName}</p>
                <p>Email: {data.adminInfo.email}</p>
              </div>
            </DashboardCard>

            <DashboardCard
              title="System Overview"
              icon={<LayoutDashboard className="h-4 w-4 text-gray-500" />}
            >
              <div className="space-y-2">
                <p>Total Users: {data.systemStats.totalUsers}</p>
                <p>Active Doctors: {data.systemStats.activeDoctor}</p>
                <p>Active Patients: {data.systemStats.activePatients}</p>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Today's Activity"
              icon={<Activity className="h-4 w-4 text-gray-500" />}
            >
              <div className="space-y-2">
                <p>New Appointments: {data.dailyStats.newAppointments}</p>
                <p>Completed Visits: {data.dailyStats.completedVisits}</p>
                <p>Pending Bills: {data.dailyStats.pendingBills}</p>
              </div>
            </DashboardCard>

            <DashboardCard
              title="System Alerts"
              icon={<AlertCircle className="h-4 w-4 text-gray-500" />}
            >
              <div className="space-y-2">
                {data.systemAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        alert.priority === "HIGH"
                          ? "bg-red-500"
                          : alert.priority === "MEDIUM"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <p>{alert.message}</p>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        );
      default:
        return (
          <Alert>
            <AlertDescription>Unknown user role</AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {userData.user_role.charAt(0) +
          userData.user_role.slice(1).toLowerCase()}{" "}
        Dashboard
      </h1>
      {renderDashboard()}
    </div>
  );
};

export default Overview;
