import Doctor from "../../models/Tables/Doctor.js";
import Appointment from "../../models/Tables/Appointment.js";
import Specialty from "../../models/Tables/Specialties.js";
import DoctorSpecialties from "../../models/Tables/DoctorSpecialties.js";
import Office from "../../models/Tables/Office.js";
import SpecialistApproval from "../../models/Tables/SpecialistApproval.js";
import Patient from "../../models/Tables/Patient.js";
import DoctorOffices from "../../models/Tables/DoctorOffices.js";
import User from "../../models/Tables/Users.js";
import { Op } from "@sequelize/core";

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

        // Phone validation (XXX-XXX-XXXX)
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
        // Simple password validation
        if (data.newPassword !== data.confirmPassword) {
          return res.status(400).json({
            success: false,
            message: "New passwords do not match.",
          });
        }

        // Update password without encryption
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
            // Fixed to use proper association names
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
            // Fixed doctor specialties association
            data = await Doctor.findAll({
              include: [
                {
                  model: Specialty,
                  through: DoctorSpecialties,
                },
                {
                  model: Office,
                  through: DoctorOffices,
                  attributes: ["office_name", "office_address"],
                },
              ],
              attributes: ["doctor_id", "doctor_fname", "doctor_lname"],
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
            // Fixed to use correct association aliases
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

const defaultDashboard = {
  populateMYAPPOINTMENTS,
  updateSETTINGS,
};
export default defaultDashboard;
