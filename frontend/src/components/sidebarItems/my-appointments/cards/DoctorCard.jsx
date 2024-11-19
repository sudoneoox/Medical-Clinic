import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "../../../../utils/Card.tsx";
import { Alert, AlertDescription } from "../../../../utils/Alerts.tsx";
import { parseAvailability } from "../utils/Parsers.js";
import DateTimePickerModal from "../modals/DateTimePickerModal";
import SpecialistApprovalModal from "../modals/SpecialistApprovalModal";
import { groupSlotsByDay, formatTimeSlots } from "../utils/timeFormatters";
import api from "../../../../api.js";

const DoctorCard = ({ doctor , patientId}) => {
  // state management
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [requestingApproval, setRequestingApproval] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [primaryDoctor, setPrimaryDoctor] = useState(null);
  const [isPrimaryDoctor, setIsPrimaryDoctor] = useState(false);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const checkPrimaryDoctor = async () => {
      let response; // Declare response outside of the try block
      try {
        if (userRole === "RECEPTIONIST") {
          console.log("Entering receptionist");
    
          response = await api.post("/users/portal/getPrimaryDoctor", {
            user_id: localStorage.getItem("userId"),
            userRole,
            patientId,
          });
          console.log(response);
        } else {
          response = await api.post("/users/portal/getPrimaryDoctor", {
            user_id: localStorage.getItem("userId"),
            userRole,
          });
        }
    
        // Now response is defined in this scope
        if (response?.data?.data?.doctor) {
          setIsPrimaryDoctor(
            response.data.data.doctor.doctor_id === doctor.doctor_id,
          );
        }
      } catch (error) {
        console.error("Error checking primary doctor:", error);
      }
    };

    checkPrimaryDoctor();
  }, [doctor.doctor_id]);

  //BUG: trigger doesnt work on first doctor on list
  //need to chagne up doctor how theyre fetching their approval
  //this sucks need to clean up and also the way i implemented it is so messy but were on short time
  const fetchPrimaryDoctor = async () => {
    let response; 
    try {
      if (userRole === "RECEPTIONIST") {
        console.log("Entering receptionist");
        response = await api.post("/users/portal/getPrimaryDoctor", {
          user_id: localStorage.getItem("userId"),
          userRole,
          patientId,
        });
        console.log(response);
      } else {
        response = await api.post("/users/portal/getPrimaryDoctor", {
          user_id: localStorage.getItem("userId"),
          userRole,
        });
      }
      console.log("PRIMARY DOCTOR FOUND ", response.data.data.doctor);
      if (response?.data?.data?.doctor) {
        setPrimaryDoctor(response.data.data);
        localStorage.setItem(
          "primaryDoctor",
          response.data.data.doctor.doctor_id,
        );
        return response.data.data.doctor;
      }
      return null;
    } catch (error) {
      console.error("Error fetching primary doctor:", error);
    }
    // try {
    //   const response = await api.post("/users/portal/getPrimaryDoctor", {
    //     user_id: localStorage.getItem("userId"),
    //   });
    //   console.log("PRIMARY DOCTOR FOUND ", response.data.data.doctor);
    //   if (response?.data?.data?.doctor) {
    //     setPrimaryDoctor(response.data.data);
    //     localStorage.setItem(
    //       "primaryDoctor",
    //       response.data.data.doctor.doctor_id,
    //     );
    //     return response.data.data.doctor;
    //   }
    //   return null;
    // } catch (error) {
    //   console.error("Error fetching primary doctor:", error);
    // }
  };
  const handleApprovalRequest = async () => {
    if (!approvalReason.trim() || !selectedDateTime) {
      setBookingError("Please fill in all the required fields");
      return;
    }
    if (!primaryDoctor) {
      setBookingError("Unable to find primary doctor information");
    }
    let response;
    try {
      setRequestingApproval(true);
      if (userRole === "RECEPTIONIST") {
        console.log(localStorage.getItem("primaryDoctor"));
        
        response = await api.post(
          "/users/portal/requestSpecialistApproval",
          {
            user_id: localStorage.getItem("userId"),
            specialist_id: doctor.doctor_id,
            primary_doctor_id: localStorage.getItem("primaryDoctor"),
            reason: approvalReason,
            appointment_datetime: selectedDateTime
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            office_name: selectedOffice,
            userRole,
            patientId,
          },
        );
      } else {
        response = await api.post(
          "/users/portal/requestSpecialistApproval",
          {
            user_id: localStorage.getItem("userId"),
            specialist_id: doctor.doctor_id,
            primary_doctor_id: localStorage.getItem("primaryDoctor"),
            reason: approvalReason,
            appointment_datetime: selectedDateTime
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            office_name: selectedOffice,
            userRole,
          },
        );
      }
      // response = await api.post(
      //   "/users/portal/requestSpecialistApproval",
      //   {
      //     user_id: localStorage.getItem("userId"),
      //     specialist_id: doctor.doctor_id,
      //     primary_doctor_id: localStorage.getItem("primaryDoctor"),
      //     reason: approvalReason,
      //     appointment_datetime: selectedDateTime
      //       .toISOString()
      //       .slice(0, 19)
      //       .replace("T", " "),
      //     office_name: selectedOffice,
      //   },
      // );

      if (response.data.success) {
        setShowApprovalModal(false);
        setApprovalReason("");
      }
    } catch (error) {
      setBookingError(
        error.response?.data?.message || "Error requesting approval",
      );
    } finally {
      setRequestingApproval(false);
    }
  };

  const handleScheduleClick = () => {
    console.log("Button Clicked in handleScheduleClick");
    setShowDatePicker(true);
  };
  const handleAppointmentSubmit = async () => {
    let response;
    if (!selectedDateTime || !selectedOffice) {
      return;
    }
    try {
      setBookingError(null);
      // format date to mysql timestamp
      const formattedDateTime = selectedDateTime
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      if (userRole === "RECEPTIONIST") {
        console.log(patientId);
        
        response = await api.post("/users/portal/submitNewAppointment", {
          user_id: localStorage.getItem("userId"),
          user_role: localStorage.getItem("userRole"),
          doctor_id: doctor.doctor_id,
          office_name: selectedOffice,
          appointment_datetime: formattedDateTime,
          patientId,
        });
      } else {
        response = await api.post("/users/portal/submitNewAppointment", {
          user_id: localStorage.getItem("userId"),
          user_role: localStorage.getItem("userRole"),
          doctor_id: doctor.doctor_id,
          office_name: selectedOffice,
          appointment_datetime: formattedDateTime,
        });
      }

      if (response.data.success) {
        console.log("Attending Nurse", response.data.attending_nurse);
        setShowDatePicker(false);
        return;
      }
    } catch (error) {
      console.log("GOT ERROR ", error.response?.data?.message);
      if (error.response?.data?.message === "DUPLICATE_APPOINTMENT_TIME") {
        setBookingError(
          "This time slot is already booked. Please select a different time.",
        );
      } else if (
        error.response?.data?.message === "SPECIALIST_APPROVAL_REQUIRED"
      ) {
        setShowDatePicker(false);
        const primaryDoc = await fetchPrimaryDoctor();
        if (!primaryDoc) {
          setBookingError(
            "Unable to proceed: Primary Doctor information not found",
          );
          return;
        }
        setShowApprovalModal(true);
      } else if (error.response?.data?.message === "BILLING_LIMIT_REACHED") {
        setShowDatePicker(false);
        setBookingError(
          "Unable to schedule appointment: You have 3 or more unpaid bills. Please settle your outstanding payments before scheduling new appointments.",
        );
      } else {
        setBookingError(
          error.response?.data?.message || "Error booking appointment",
        );
      }
    }
  };

  return (
    <div className="relative">
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">
                Dr. {doctor.doctor_fname} {doctor.doctor_lname}
              </h4>
              {isPrimaryDoctor && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Primary Doctor
                </span>
              )}
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
                  {doctor.availability && (
                    <div className="mt-2">
                      {Object.entries(
                        groupSlotsByDay(parseAvailability(doctor.availability)),
                      ).map(([officeName, data], idx) => (
                        <div
                          key={idx}
                          className="mb-4 border-l-2 border-blue-200 pl-3"
                        >
                          <p className="text-sm font-semibold text-gray-800">
                            {officeName}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">
                            {data.address}
                          </p>
                          {Object.entries(data.days).map(
                            ([day, slots], dayIdx) => (
                              <div key={dayIdx} className="mb-1">
                                <p className="text-sm">
                                  <span className="font-medium">
                                    {day.charAt(0) + day.slice(1).toLowerCase()}
                                    :{" "}
                                  </span>
                                  <span className="text-gray-600">
                                    {formatTimeSlots(slots)}
                                  </span>
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {selectedDateTime && (
                <p className="text-sm text-gray-600">
                  Selected: {selectedDateTime.toLocaleString()}
                </p>
              )}
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                onClick={handleScheduleClick}
              >
                {!selectedDateTime ? "Select Time" : "Schedule"}
              </button>
            </div>
          </div>

          {bookingError && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{bookingError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {showDatePicker && (
        <DateTimePickerModal
          open={showDatePicker}
          onOpenChange={setShowDatePicker}
          doctor={doctor}
          selectedDateTime={selectedDateTime}
          setSelectedDateTime={setSelectedDateTime}
          selectedOffice={selectedOffice}
          setSelectedOffice={setSelectedOffice}
          onConfirm={handleAppointmentSubmit}
        />
      )}

      {showApprovalModal && (
        <SpecialistApprovalModal
          open={showApprovalModal}
          onOpenChange={(open) => {
            setShowApprovalModal(open);
            if (!open) {
              setApprovalReason("");
            }
          }}
          approvalReason={approvalReason}
          setApprovalReason={setApprovalReason}
          selectedDateTime={selectedDateTime}
          requestingApproval={requestingApproval}
          onConfirm={handleApprovalRequest}
          primaryDoctor={primaryDoctor}
        />
      )}
    </div>
  );
};

export default DoctorCard;
