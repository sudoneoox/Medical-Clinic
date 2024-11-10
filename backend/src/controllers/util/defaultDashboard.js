import Doctor from "../../models/Tables/Doctor.js";
import Appointment from "../../models/Tables/Appointment.js";
import Specialty from "../../models/Tables/Specialties.js";
import DoctorSpecialties from "../../models/Tables/DoctorSpecialties.js";
import Office from "../../models/Tables/Office.js";
import SpecialistApproval from "../../models/Tables/SpecialistApproval.js";
import Patient from "../../models/Tables/Patient.js";
import DoctorOffices from "../../models/Tables/DoctorOffices.js";
import User from "../../models/Tables/Users.js";
import DoctorAvailibility from "../../models/Tables/AvailableDoctors.js";
import { Op } from "@sequelize/core";
import TimeSlots from "../../models/Tables/TimeSlots.js";
import sequelize from "../../config/database.js";

const updateSETTINGS = async (user, relatedEntity, settingsData, res) => {
  const { section, data } = settingsData;

  try {
    switch (section) {
      case "account":
        // Check email uniqueness
        if (data.email) {
          const existingEmail = await User.findOne({
            where: {
              user_email: data.email,
              user_id: { [Op.ne]: user.user_id }, // Exclude current user
            },
          });
          if (existingEmail) {
            return res.status(400).json({
              success: false,
              message: "This email is already registered to another account.",
            });
          }
        }

        // Check username uniqueness
        if (data.username) {
          const existingUsername = await User.findOne({
            where: {
              user_username: data.username,
              user_id: { [Op.ne]: user.user_id }, // Exclude current user
            },
          });
          if (existingUsername) {
            return res.status(400).json({
              success: false,
              message: "This username is already taken.",
            });
          }
        }

        // Phone validation
        if (data.phone && !data.phone.match(/^\d{3}-\d{3}-\d{4}$/)) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid phone number format. Please use XXX-XXX-XXXX format.",
          });
        }

        // Update user account information
        await User.update(
          {
            user_email: data.email,
            user_phone: data.phone,
            user_username: data.username,
          },
          { where: { user_id: user.user_id } },
        );
        break;

      case "password":
        // password validation
        if (data.newPassword !== data.confirmPassword) {
          return res.status(400).json({
            success: false,
            message: "New passwords do not match.",
          });
        }

        await User.update(
          { user_password: data.newPassword },
          { where: { user_id: user.user_id } },
        );
        break;

      case "emergency":
        if (user.user_role !== "PATIENT") {
          return res.status(403).json({
            success: false,
            message: "Only patients can update emergency contacts",
          });
        }

        // TODO: later check
        for (const contact of data.contacts) {
          if (!contact.name || !contact.relationship || !contact.phone) {
            return res.status(400).json({
              success: false,
              message: "All emergency contact fields are required",
            });
          }

          if (!contact.phone.match(/^\d{3}-\d{3}-\d{4}$/)) {
            return res.status(400).json({
              success: false,
              message:
                "Invalid phone format for emergency contact. Please use XXX-XXX-XXXX format.",
            });
          }
        }

        // Update emergency contacts
        await Patient.update(
          { emergency_contacts: JSON.stringify(data.contacts) },
          { where: { user_id: user.user_id } },
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          message: `Invalid settings section: ${section}`,
        });
    }

    res.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating settings. Please try again.",
    });
  }
};

const populateMYAPPOINTMENTS = async (
  user,
  relatedEntity,
  appointmentData,
  res,
) => {
  console.log(appointmentData);
  const { appointmentType, action } = appointmentData;
  console.log("RECEIVED INSIDE populateAPPOINTMENTS");
  console.log(user.user_role, appointmentType, action);

  try {
    let data;
    switch (user.user_role) {
      case "PATIENT": {
        switch (appointmentType) {
          case "CURRENT": {
            // Fixed Doctor association includes
            data = await Appointment.findAll({
              where: {
                patient_id: relatedEntity.patient_id,
                status: "CONFIRMED",
                appointment_datetime: {
                  [Op.gt]: new Date(),
                },
              },
              include: [
                {
                  model: Doctor,
                  include: [
                    {
                      model: Specialty,
                      through: DoctorSpecialties,
                    },
                  ],
                },
                {
                  model: Office,
                  attributes: ["office_name", "office_address"],
                },
              ],
              order: [["appointment_datetime", "ASC"]],
            });
            break;
          }
          case "PENDING": {
            data = await Appointment.findAll({
              where: {
                patient_id: relatedEntity.patient_id,
                status: "PENDING",
              },
              include: [
                {
                  model: Doctor,
                  include: [
                    {
                      model: Specialty,
                      through: DoctorSpecialties,
                    },
                  ],
                },
                {
                  model: Office,
                  attributes: ["office_name", "office_address"],
                },
              ],
              order: [["created_at", "DESC"]],
            });
            break;
          }

          case "AVAILABLE_DOCTORS": {
            data = await Doctor.findAll({
              include: [
                {
                  model: Specialty,
                  through: DoctorSpecialties,
                  attributes: ["specialty_name", "specialty_code"],
                },
                {
                  model: Office,
                  through: DoctorOffices,
                  attributes: ["office_name", "office_address"],
                },
                {
                  model: DoctorAvailibility,
                  include: [
                    {
                      model: TimeSlots,
                      attributes: ["start_time", "end_time"],
                    },
                  ],
                  where: {
                    is_available: 1,
                    // if date is null, its a weekly occuring slot,
                    [Op.or]: [
                      { specific_date: null },
                      { specific_date: { [Op.gte]: new Date() } },
                    ],
                  },
                },
              ],
              attributes: [
                "doctor_id",
                "doctor_fname",
                "doctor_lname",
                [
                  sequelize.literal(`(
                  SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'day', day_of_week,
                            'office_name', office_name,
                            'office_address', office_address,
                            'time_slots', time_slots
                        )
                    )
                    FROM doctor_available_slots
                    WHERE doctor_id = Doctor.doctor_id
                )`),
                  "availability",
                ],
              ],
            });
            break;
          }
          default:
            throw new Error("Invalid appointment type for patient");
        }
        break;
      }
      case "DOCTOR": {
        switch (appointmentType) {
          case "UPCOMING": {
            // Get doctor's upcoming appointments
            data = await Appointment.findAll({
              where: {
                doctor_id: relatedEntity.doctor_id,
                status: "CONFIRMED",
                appointment_datetime: {
                  [Op.gt]: new Date(),
                },
              },
              include: [
                {
                  model: Patient,
                  attributes: ["patient_fname", "patient_lname"],
                },
                {
                  model: Office,
                  attributes: ["office_name", "office_address"],
                },
              ],
              order: [["appointment_datetime", "ASC"]],
            });
            break;
          }

          case "PENDING_APPROVALS": {
            data = await SpecialistApproval.findAll({
              where: {
                reffered_doctor_id: relatedEntity.doctor_id,
                specialist_status: "PENDING",
              },
              include: [
                {
                  model: Patient,
                  attributes: ["patient_fname", "patient_lname"],
                },
                {
                  model: Doctor,
                  as: "specialist",
                  include: [
                    {
                      model: Specialty,
                      through: DoctorSpecialties,
                    },
                  ],
                },
              ],
              order: [["requested_at", "DESC"]],
            });
            break;
          }

          case "SPECIALIST_REQUESTS": {
            // First get specialist approvals, then get corresponding appointments
            const approvals = await SpecialistApproval.findAll({
              where: {
                specialist_id: relatedEntity.doctor_id,
                specialist_status: "APPROVED",
              },
              attributes: ["patient_id"],
            });

            const patientIds = approvals.map((a) => a.patient_id);

            data = await Appointment.findAll({
              where: {
                doctor_id: relatedEntity.doctor_id,
                status: "PENDING",
                patient_id: {
                  [Op.in]: patientIds,
                },
              },
              include: [
                {
                  model: Patient,
                  attributes: ["patient_fname", "patient_lname"],
                },
              ],
              order: [["created_at", "DESC"]],
            });
            break;
          }
          default:
            throw new Error("Invalid appointment type for doctor");
        }
        break;
      }
      default:
        throw new Error(`Invalid user role ${user.user_role} for appointments`);
    }
    console.log("FINISHED DATA: ", data);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

const submitNewAppointment = async (req, res) => {
  const { user_id, doctor_id, office_name, appointment_datetime } = req.body;

  try {
    // Get patient_id from user_id
    const patient = await Patient.findOne({
      where: { user_id },
    });

    // Get office_id from office_name
    const office = await Office.findOne({
      where: { office_name },
    });

    // format datetime for mysql
    const formattedDateTime = new Date(appointment_datetime)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Create the appointment
    const appointment = await Appointment.create({
      patient_id: patient.patient_id,
      doctor_id,
      office_id: office.office_id,
      appointment_datetime: formattedDateTime,
      duration: "00:30:00", // Default 30 min duration
      status: "PENDING", // Will be updated by trigger if specialist approval needed
      reason: req.body.reason || "Regular checkup",
    });

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Appointment creation error", error);
    // The specialist approval trigger will throw SPECIALIST_APPROVAL_REQUIRED
    if (error.message.includes("SPECIALIST_APPROVAL_REQUIRED")) {
      res.status(400).json({
        message: "SPECIALIST_APPROVAL_REQUIRED",
      });
    } else {
      res.status(500).json({
        message: error.message || "Error creating appointment",
      });
    }
  }
};

const requestSpecialistApproval = async (req, res) => {
  const {
    user_id,
    specialist_id,
    primary_doctor_id,
    reason,
    appointment_datetime,
    office_name,
  } = req.body;

  try {
    // Get patient_id from user_id
    const patient = await Patient.findOne({
      where: { user_id },
    });

    // Get office_id from office_name
    const office = await Office.findOne({
      where: { office_name },
    });

    // First create a pending appointment
    const appointment = await Appointment.create({
      patient_id: patient.patient_id,
      doctor_id: specialist_id,
      office_id: office.office_id,
      appointment_datetime,
      duration: "00:30:00", // Default 30 min duration
      status: "PENDING_APPROVAL",
      reason: reason,
    });

    // Create the specialist approval request
    const approvalRequest = await SpecialistApproval.create({
      appointment_id: appointment.appointment_id,
      patient_id: patient.patient_id,
      specialist_id: specialist_id,
      primary_doctor_id: primary_doctor_id,
      request_reason: reason,
      status: "PENDING",
      requested_datetime: new Date(),
    });

    res.json({
      success: true,
      data: {
        appointment,
        approvalRequest,
      },
    });
  } catch (error) {
    console.error("Error requesting specialist approval:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error requesting specialist approval",
    });
  }
};
const defaultDashboard = {
  populateMYAPPOINTMENTS,
  updateSETTINGS,
  submitNewAppointment,
  requestSpecialistApproval,
};
export default defaultDashboard;
