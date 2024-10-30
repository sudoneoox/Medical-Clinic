import Doctor from "../../models/Tables/Doctor.js";
import Appointment from "../../models/Tables/Appointment.js";
import Specialty from "../../models/Tables/Specialties.js";
import DoctorSpecialties from "../../models/Tables/DoctorSpecialties.js";
import Office from "../../models/Tables/Office.js";
import SpecialistApproval from "../../models/Tables/SpecialistApproval.js";
import Patient from "../../models/Tables/Patient.js";
import DoctorOffices from "../../models/Tables/DoctorOffices.js";

import { Op } from "@sequelize/core";

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
};
export default defaultDashboard;
