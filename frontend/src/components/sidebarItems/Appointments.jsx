import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  ClipboardCheck,
  UserPlus,
  AlertCircle,
  Check,
} from "lucide-react";
import { Card, CardContent } from "../../utils/Card.tsx";
import { Alert, AlertDescription } from "../../utils/Alerts.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "../../utils/Dialog.tsx";
import { Button } from "../../utils/Button.tsx";
import api from "../../api.js";

const CategoryCard = ({ title, icon, description, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-4 rounded-lg border transition-all ${
      isSelected
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:border-blue-300"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

const DoctorCard = ({ doctor }) => {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [requestingApproval, setRequestingApproval] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Calculate available time slots (9 AM to 5 PM, 30 min intervals)
  const getTimeSlots = (selectedDate) => {
    const slots = [];
    const start = new Date(selectedDate);
    start.setHours(9, 0, 0); // 9 AM
    const end = new Date(selectedDate);
    end.setHours(17, 0, 0); // 5 PM

    while (start < end) {
      slots.push(new Date(start));
      start.setMinutes(start.getMinutes() + 30);
    }
    return slots;
  };

  const handleDateSelect = (date) => {
    setSelectedDateTime(date);
    setShowDatePicker(false);
  };

  const handleScheduleClick = async () => {
    if (!selectedDateTime) {
      setShowDatePicker(true);
      return;
    }

    try {
      setBookingError(null);
      const response = await api.post("/users/portal/submitNewAppointment", {
        user_id: localStorage.getItem("userId"),
        user_role: localStorage.getItem("userRole"),
        doctor_id: doctor.doctor_id,
        appointment_datetime: selectedDateTime,
      });

      if (response.data.success) {
        // TODO: have to implement better refresh this will put them back into the overview
        window.location.reload();
      }
    } catch (error) {
      // TRIGGER error state set as this message
      if (error.response?.data?.message === "SPECIALIST_APPROVAL_REQUESTED") {
        setShowApprovalModal(true);
      } else {
        // ANOTHER ERROR WAS ENCOUNTERED BESIDES THE TRIGGER RESPONSE
        setBookingError(
          error.response?.data?.message || "Error booking appointment",
        );
      }
    }
  };
  const handleApprovalRequest = async () => {
    if (!approvalReason.trim() || !selectedDateTime) {
      return;
    }
    try {
      setRequestingApproval(true);
      const response = await api.post(
        "/users/portal/requestSpecialistApproval",
        {
          user_id: localStorage.getItem("userId"),
          specialist_id: doctor.doctor_id,
          reason: approvalReason,
          appointment_datetime: selectedDateTime,
        },
      );
      if (response.data.success) {
        setShowApprovalModal(false);
        setApprovalReason("");
      }
    } catch (error) {
      // Error occured show it
      setBookingError(
        error.response?.data?.message || "Error requesting approval",
      );
    } finally {
      setRequestingApproval(false);
    }
  };
  return (
    <>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">
                Dr. {doctor.doctor_fname} {doctor.doctor_lname}
              </h4>
              {doctor.specialties && doctor.specialties.length > 0 && (
                <p className="text-sm text-blue-600 mt-1">
                  {doctor.specialties
                    .map((spec) => spec.specialty_name)
                    .join(", ")}
                </p>
              )}
              {doctor.offices && doctor.offices.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 font-medium">
                    Available at:
                  </p>
                  {doctor.offices.map((office, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      {office.office_name} - {office.office_address}
                    </p>
                  ))}
                </div>
              )}
            </div>
            {/* TIMES */}
            <div className="flex flex-col gap-2">
              {selectedDateTime && (
                <p className="text-sm text-gray-600">
                  Selected: {selectedDateTime.toLocaleString()}
                </p>
              )}
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={handleScheduleClick}
              >
                {!selectedDateTime ? "Select Time" : "Schedule"}
              </button>
            </div>
          </div>

          {/* ERRORS SHOW UP HERE */}
          {bookingError && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{bookingError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* DATE / TIME SELECTION MODAL */}
      <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Appointment Date & Time</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4">
              {/* You might want to use a proper date picker component here */}
              <input
                type="date"
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  if (!isNaN(date.getTime())) {
                    setSelectedDateTime(date);
                  }
                }}
                min={new Date().toISOString().split("T")[0]}
              />
              {selectedDateTime && (
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    const date = new Date(selectedDateTime);
                    const [hours, minutes] = e.target.value.split(":");
                    date.setHours(parseInt(hours), parseInt(minutes), 0);
                    setSelectedDateTime(date);
                  }}
                >
                  {getTimeSlots(selectedDateTime).map((slot, index) => (
                    <option
                      key={index}
                      value={`${slot.getHours()}:${slot.getMinutes()}`}
                    >
                      {slot.toLocaleTimeString()}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDatePicker(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowDatePicker(false);
                handleScheduleClick();
              }}
              disabled={!selectedDateTime}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Specialist Approval Modal */}
      {/* Also handles (Trigger was triggered show UI for it)  */}
      {showApprovalModal && (
        <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Specialist Approval Required</DialogTitle>
              <DialogDescription>
                This doctor is a specialist. You need approval from your primary
                doctor first. Would you like to submit an approval request?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Reason for specialist appointment..."
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                rows={4}
              />
              {selectedDateTime && (
                <p className="text-sm text-gray-600">
                  Requested appontment time: {selectedDateTime.toLocaleString()}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowApprovalModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprovalRequest}
                disabled={
                  requestingApproval ||
                  !approvalReason.trim() ||
                  !selectedDateTime
                }
              >
                {requestingApproval ? "Requesting..." : "Request Approval"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

const AppointmentCard = ({ appointment, type }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">
              {type === "patient"
                ? `Dr. ${appointment.doctor?.doctor_fname} ${appointment.doctor?.doctor_lname}`
                : `${appointment.patient?.patient_fname} ${appointment.patient?.patient_lname}`}
            </h4>
            <p className="text-sm text-gray-600">
              {formatDate(appointment.appointment_datetime)}
            </p>
            <p className="text-sm text-gray-600">
              {appointment.office?.office_name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Duration: {appointment.duration}
            </p>
            <p className="text-sm text-gray-500 mt-2">{appointment.reason}</p>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                appointment.status === "CONFIRMED"
                  ? "bg-green-100 text-green-800"
                  : appointment.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {appointment.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Appointments = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userRole = localStorage.getItem("userRole");

  const categoryOptions =
    userRole === "PATIENT"
      ? // if else statement
        [
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
          // DOCTORS
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

        {/* Category Cards */}
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

        {/* Content Area */}
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
