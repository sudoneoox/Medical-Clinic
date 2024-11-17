import Appointment from "../../models/Tables/Appointment.js";
import Doctor from "../../models/Tables/Doctor.js";
import Office from "../../models/Tables/Office.js";
import MedicalRecord from "../../models/Tables/MedicalRecord.js";
import Patient from "../../models/Tables/Patient.js";
import Specialty from "../../models/Tables/Specialties.js";
import { Op } from "@sequelize/core";

// TODO: for medical records and appointments order them by date to find the most recent ones and only show the top 3
// could use this if we had a more descriptive medicalrecord entity or maybe add a score attribute to make a graph
// like the inspiration were taking from to make an overall health graph
const populateOVERVIEW = async (user, patient, res) => {
  try {
    // Get appointments with associations
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    // appointments ordered
    const appointments = await Patient.findOne({
      where: { patient_id: patient.patient_id },
      include: [
        {
          model: Appointment,
          where: {
            status: "CONFIRMED",
            appointment_datetime: { [Op.gt]: endOfToday },
          },
          required: false,
          order: [["appointment_datetime", "ASC"]],
          include: [
            {
              model: Doctor,
              attributes: ["doctor_fname", "doctor_lname"],
            },
            {
              model: Office,
              attributes: ["office_name", "office_address"],
            },
          ],
        },
      ],
    });

    // Get medical records
    const medicalRecords = await Patient.findOne({
      where: { patient_id: patient.patient_id },
      include: [
        {
          model: MedicalRecord,
          where: { is_deleted: 0 },
          required: false,
          include: [
            {
              model: Doctor,
              attributes: ["doctor_fname", "doctor_lname"],
            },
          ],
        },
      ],
    });

    return res.json({
      patientInfo: {
        name: `${patient.patient_fname} ${patient.patient_lname}`,
        email: user.user_email,
        phone: user.user_phone,
        emergencyContacts: patient.emergency_contacts,
      },
      appointments: appointments?.appointments || [],
      medicalRecords: medicalRecords?.medicalRecords || [],
    });
  } catch (error) {
    console.error("Error in populateOVERVIEWForPatient:", error);
    res.status(500).json({
      message: "Error loading patient dashboard",
      error: error.message,
    });
  }
};
const populateCALENDAR = async (user, patient, res) => {
  try {
    const appointments = await Patient.findOne({
      where: { patient_id: patient.patient_id },
      include: [
        {
          model: Appointment,
          where: {
            status: "CONFIRMED",
          },
          required: false,
          order: [["appointment_datetime", "ASC"]],
          include: [
            {
              model: Doctor,
              attributes: ["doctor_fname", "doctor_lname"],
            },
            {
              model: Office,
              attributes: ["office_name", "office_address"],
            },
          ],
        },
      ],
    });

    return res.json({
      appointments: appointments?.appointments || [],
    });
  } catch (error) {
    console.error("Error in populateCALENDAR for patient:", error);
    res.status(500).json({
      message: "Error Loading Patient Calendar",
      error: error.message,
    });
  }
};

const populateAPPOINTMENTS = async (user, patient, res) => {
  try {
    console.log("received inside populateAPPOINTMENTS");
    const appointments = await Patient.findOne({
      where: { patient_id: patient.patient_id },
      include: [
        {
          model: Appointment,
          where: {
            status: "CONFIRMED",
          },
          required: false,
          order: [["appointment_datetime", "ASC"]],
          include: [
            {
              model: Doctor,
              attributes: ["doctor_fname", "doctor_lname"],
              include: [
                {
                  model: Specialty,
                  attributes: ["specialty_name"],
                },
              ],
            },
            {
              model: Office,
              attributes: ["office_name", "office_address"],
            },
          ],
        },
      ],
    });

    return res.json({
      appointments: appointments?.appointments || [],
    });
  } catch (error) {
    console.error("Error in populateCALENDAR for patients:", error);
    res.status(500).json({
      message: "Error loading patient calendar",
      error: error.message,
    });
  }
};

const populateMEDICALRECORDS = async (user, patient, res) => {
  console.log("received in populateMEDICALRECORDS");
  try {
    const patientId = patient.patient_id;
    console.log(`Fetching medical records for patient ID: ${patientId}`);

    const medicalRecords = await MedicalRecord.findAll({
      where: { patient_id: patientId, is_deleted: 0 },
    });
    
    return res.json(medicalRecords);
  } catch (error) {
    console.error("Error fetching medical data:", error);
    return res.status(500).json({ 
      message: "Error fetching medical data", 
      error: error.message 
    });
  }
};

const deleteAppointments = async (req, res) => {
  
  try {
    const appointmentId = req.params.appointment_id;
    console.log(appointmentId, "Appointment ID");

    const deleteAppt = await Appointment.findOne({
      where: {appointment_id: appointmentId},
    })

    if (deleteAppt) {
      await deleteAppt.update({
        status: "CANCELLED",
      });
      return res
        .status(200)
        .json({ message: "Successfully CANCELLED appointment" , success: true});
    }
    return res
        .status(500)
        .json({ message: "Appointment Not found" , success: false});
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).json({
      message: "Error cancelling appointment",
      error: error.message,
    });
  }
}

const patientDashboard = {
  populateOVERVIEW,
  populateCALENDAR,
  populateAPPOINTMENTS,
  populateMEDICALRECORDS,
  deleteAppointments,
};

export default patientDashboard;
