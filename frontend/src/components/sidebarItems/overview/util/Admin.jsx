import DashboardCard from "../DashboardCard";
import { AlertCircle, Activity, Shield, LayoutDashboard } from "lucide-react";
const Admin = ({ data }) => {
  const fullName = localStorage.getItem("userFullName");
  const email = localStorage.getItem("userEmail");

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Admin Info"
        icon={<Shield className="h-4 w-4 text-gray-500" />}
      >
        <div className="space-y-2">
          <p>Name: {fullName}</p>
          <p>Email: {email}</p>
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
};

export default Admin;
