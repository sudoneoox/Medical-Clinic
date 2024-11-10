import React, { useState } from "react";
import {
  Calendar,
  Clock,
  ClipboardCheck,
  UserPlus,
  AlertCircle,
  Check,
} from "lucide-react";
import { Alert, AlertDescription } from "../../../utils/Alerts.tsx";
import CategoryCard from "./cards/CategoryCard";
import DoctorCard from "./cards/DoctorCard";
import AppointmentCard from "./cards/AppointmentCard";
import api from "../../../api.js";

const Appointments = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userRole = localStorage.getItem("userRole");

  const categoryOptions =
    userRole === "PATIENT"
      ? [
          {
            id: "CURRENT",
            title: "Current Appointments",
            icon: <Calendar className="w-6 h-6 text-blue-500" />,
            description: "View your upcoming confirmed appointments",
          },
          {
            id: "PENDING",
            title: "Pending Appointments",
            icon: <Clock className="w-6 h-6 text-yellow-500" />,
            description: "View your pending specialist appointments",
          },
          {
            id: "AVAILABLE_DOCTORS",
            title: "Schedule New Appointment",
            icon: <UserPlus className="w-6 h-6 text-green-500" />,
            description: "Book a new appointment with a doctor",
          },
        ]
      : [
          {
            id: "UPCOMING",
            title: "Upcoming Appointments",
            icon: <Calendar className="w-6 h-6 text-blue-500" />,
            description: "View your scheduled appointments",
          },
          {
            id: "PENDING_APPROVALS",
            title: "Pending Approvals",
            icon: <ClipboardCheck className="w-6 h-6 text-yellow-500" />,
            description: "Review specialist appointment requests",
          },
          {
            id: "SPECIALIST_REQUESTS",
            title: "Specialist Appointments",
            icon: <Check className="w-6 h-6 text-green-500" />,
            description: "View appointments pending your approval",
          },
        ];

  const fetchData = async (appointmentType) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/users/portal/my-appointments", {
        user_id: localStorage.getItem("userId"),
        user_role: userRole,
        sidebarItem: "MY-APPOINTMENTS",
        appointmentData: {
          appointmentType: appointmentType,
        },
      });

      setData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchData(categoryId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Appointments</h2>
        <p className="text-gray-600 mb-6">
          {userRole === "PATIENT"
            ? "View and manage your appointments"
            : "Manage your appointments and approval requests"}
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {categoryOptions.map((option) => (
            <CategoryCard
              key={option.id}
              {...option}
              isSelected={selectedCategory === option.id}
              onClick={() => handleCategorySelect(option.id)}
            />
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : data ? (
          <div className="space-y-4">
            {data.length > 0 ? (
              data.map((item) =>
                selectedCategory === "AVAILABLE_DOCTORS" ? (
                  <DoctorCard key={item.doctor_id} doctor={item} />
                ) : (
                  <AppointmentCard
                    key={item.appointment_id || item.approval_id}
                    appointment={item}
                    type={userRole.toLowerCase()}
                  />
                ),
              )
            ) : (
              <div className="text-center text-gray-500 py-8">
                No {selectedCategory?.toLowerCase().replace("_", " ")} found
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Select a category to view appointments
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
