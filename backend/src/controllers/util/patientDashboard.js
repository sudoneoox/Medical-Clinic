import Appointment from "../../models/Tables/Appointment.js";
import Doctor from "../../models/Tables/Doctor.js";
import Office from "../../models/Tables/Office.js";
import MedicalRecord from "../../models/Tables/MedicalRecord.js";
import Patient from "../../models/Tables/Patient.js";

// TODO: for medical records and appointments order them by date to find the most recent ones and only show the top 3
// could use this if we had a more descriptive medicalrecord entity or maybe add a score attribute to make a graph
// like the inspiration were taking from to make an overall health graph
const populateOVERVIEW = async (user, patient, res) => {
  try {
    // Get appointments with associations
    const appointments = await Patient.findOne({
      where: { patient_id: patient.patient_id },
      include: [
        {
          model: Appointment,
          where: { status: "CONFIRMED" },
          required: false,
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
  console.log("received in populateCALENDAR");
};
const populateAPPOINTMENTS = async (user, patient, res) => {
  console.log("received in populateAPPOINTMENTS");
};
const populateMEDICALRECORDS = async (user, patient, res) => {
  console.log("received in populateMEDICALRECORDS");
};

const patientDashboard = {
  populateOVERVIEW,
  populateCALENDAR,
  populateAPPOINTMENTS,
  populateMEDICALRECORDS,
};

export default patientDashboard;
