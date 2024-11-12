import React, { useState } from "react";
import { Card, CardContent } from "../../../../utils/Card.tsx";
import { Alert, AlertDescription } from "../../../../utils/Alerts.tsx";
import { Button } from "../../../../utils/Button.tsx";
import { AlertCircle, Check, X, Clock } from "lucide-react";
import { formatDate } from "../utils/timeFormatters.js";
import api from "../../../../api.js";

const AppointmentCard = ({ appointment, type }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  console.log("=== AppointmentCard Render ===");
  console.log("Appointment data:", appointment);
  console.log("Type:", type);
  const handleApprovalAction = async (action) => {
    console.log("=== Starting Approval Action ===");
    console.log("Action:", action);
    console.log("Approval ID:", appointment.approval_id);

    try {
      setLoading(true);
      setError(null);

      // Get doctor_id from the reffered_doctor_id in the appointment data
      const doctorId = appointment.reffered_doctor_id;
      console.log("Using doctor ID:", doctorId);

      if (!appointment.approval_id) {
        throw new Error("Missing approval ID");
      }

      if (!doctorId) {
        throw new Error("Missing doctor ID");
      }

      const response = await api.post(
        "/users/portal/handleSpecialistApproval",
        {
          approval_id: appointment.approval_id,
          action: action,
          doctor_id: doctorId,
        },
      );

      console.log("API Response:", response);

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error("Error in handleApprovalAction:", err);
      console.error("Error response:", err.response);
      setError(err.response?.data?.message || "Error processing request");
    } finally {
      setLoading(false);
    }
  };
  const renderSpecialistInfo = () => {
    if (!appointment.doctor?.specialties?.length) return null;

    return (
      <div className="mt-2">
        <p className="text-sm text-blue-600">
          Specialties:{" "}
          {appointment.doctor.specialties
            .map((s) => s.specialty_name)
            .join(", ")}
        </p>
      </div>
    );
  };

  const renderApprovalStatus = () => {
    if (type === "doctor" && appointment.status === "PENDING_DOCTOR_APPROVAL") {
      return (
        <div className="mt-4 space-y-4">
          <div className="flex items-center text-sm text-yellow-600">
            <Clock className="w-4 h-4 mr-2" />
            Awaiting your approval for specialist appointment
          </div>
          {appointment.reason && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700">
                Request Reason:
              </p>
              <p className="text-sm text-gray-600">{appointment.reason}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              onClick={() => handleApprovalAction("approve")}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⌛</span>
                  Processing...
                </span>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
            <Button
              onClick={() => handleApprovalAction("deny")}
              disabled={loading}
              variant="destructive"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⌛</span>
                  Processing...
                </span>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Deny
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }
    return null;
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
            {renderSpecialistInfo()}
            <p className="text-sm text-gray-600">
              {formatDate(appointment.appointment_datetime)}
            </p>
            <p className="text-sm text-gray-600">
              {appointment.office?.office_name}
            </p>
            {appointment.duration && (
              <p className="text-sm text-gray-600 mt-1">
                Duration: {appointment.duration}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                appointment.status === "CONFIRMED"
                  ? "bg-green-100 text-green-800"
                  : appointment.status === "PENDING_DOCTOR_APPROVAL"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {appointment.status.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {renderApprovalStatus()}

        {error && (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4">
            <Check className="h-4 w-4" />
            <AlertDescription>Request processed successfully!</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
