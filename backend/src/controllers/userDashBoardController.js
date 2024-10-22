// userDashBoardController.js
import Receptionist from "../models/Tables/Receptionist.js";
import Nurse from "../models/Tables/Nurse.js";
import Doctor from "../models/Tables/Doctor.js";
import Patient from "../models/Tables/Patient.js";
import User from "../models/Tables/Users.js";
import Appointment from "../models/Tables/Appointment.js";
import MedicalRecord from "../models/Tables/MedicalRecord.js";
import Office from "../models/Tables/Office.js";

const populateDashboard = async (req, res) => {
  try {
    const { user_id, user_role } = req.body;
    console.log("received from populateDashboard: ", user_id, user_role);

    const user = await User.findOne({ where: { user_id: user_id } });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user_role.toUpperCase() !== user.user_role) {
      return res.status(401).json({ message: "Mismatching user role" });
    }

    let relatedEntity;
    switch (user.user_role) {
      case "RECEPTIONIST":
        relatedEntity = await Receptionist.findOne({
          where: { user_id: user_id },
        });
        if (!relatedEntity)
          return res.status(404).json({ message: "Receptionist not found" });
        return await populateDashboardForReceptionist(user, relatedEntity, res);

      case "NURSE":
        relatedEntity = await Nurse.findOne({ where: { user_id: user_id } });
        if (!relatedEntity)
          return res.status(404).json({ message: "Nurse not found" });
        return await populateDashboardForNurse(user, relatedEntity, res);

      case "PATIENT":
        relatedEntity = await Patient.findOne({ where: { user_id: user_id } });
        if (!relatedEntity)
          return res.status(404).json({ message: "Patient not found" });
        return await populateDashboardForPatient(user, relatedEntity, res);

      case "DOCTOR":
        relatedEntity = await Doctor.findOne({ where: { user_id: user_id } });
        if (!relatedEntity)
          return res.status(404).json({ message: "Doctor not found" });
        return await populateDashboardForDoctor(user, relatedEntity, res);

      case "ADMIN":
        return res
          .status(401)
          .json({ message: "Admin role not yet implemented" });

      default:
        return res.status(401).json({ message: "Invalid user role" });
    }
  } catch (error) {
    console.error(`Error fetching dashboard data:`, error);
    res
      .status(500)
      .json({ message: "Error fetching dashboard data", error: error.message });
  }
};

// TODO: for medical records and appointments order them by date to find the most recent ones and only show the top 3
// could use this if we had a more descriptive medicalrecord entity or maybe add a score attribute to make a graph
// like the inspiration were taking from to make an overall health graph
const populateDashboardForPatient = async (user, patient, res) => {
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
    console.log(
      `inside populatePatientDashboardForPatient received data ${user}\n\n\n ${patient}\n\n\n`,
    );

    console.log("found medicalRecords", medicalRecords);
    console.log("\n\n\n found appointments", appointments.appointments);

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
    console.error("Error in populateDashboardForPatient:", error);
    res.status(500).json({
      message: "Error loading patient dashboard",
      error: error.message,
    });
  }
};

const populateDashboardForDoctor = async (user, doctor, res) => {
  try {
    const doctorWithData = await Doctor.findOne({
      where: { doctor_id: doctor.doctor_id },
      include: [
        {
          model: Appointment,
          where: { status: "CONFIRMED" },
          required: false,
          include: [
            {
              model: Patient,
              attributes: ["patient_fname", "patient_lname"],
            },
            {
              model: Office,
              attributes: ["office_name"],
            },
          ],
        },
      ],
    });

    return res.json({
      doctorInfo: {
        name: `${doctor.doctor_fname} ${doctor.doctor_lname}`,
        email: user.user_email,
        phone: user.user_phone,
        experience: doctor.years_of_experience,
      },
      appointments: doctorWithData?.Appointments || [],
    });
  } catch (error) {
    console.error("Error in populateDashboardForDoctor:", error);
    res.status(500).json({
      message: "Error loading doctor dashboard",
      error: error.message,
    });
  }
};

const populateDashboardForNurse = async (user, nurse, res) => {
  try {
    const nurseWithData = await Nurse.findOne({
      where: { nurse_id: nurse.nurse_id },
      include: [
        {
          model: Appointment,
          where: { status: "CONFIRMED" },
          required: false,
          include: [
            {
              model: Patient,
              attributes: ["patient_fname", "patient_lname"],
            },
            {
              model: Doctor,
              attributes: ["doctor_fname", "doctor_lname"],
            },
            {
              model: Office,
              attributes: ["office_name"],
            },
          ],
        },
      ],
    });

    return res.json({
      nurseInfo: {
        name: `${nurse.nurse_fname} ${nurse.nurse_lname}`,
        email: user.user_email,
        phone: user.user_phone,
        specialization: nurse.specialization,
      },
      appointments: nurseWithData?.Appointments || [],
    });
  } catch (error) {
    console.error("Error in populateDashboardForNurse:", error);
    res
      .status(500)
      .json({ message: "Error loading nurse dashboard", error: error.message });
  }
};

const populateDashboardForReceptionist = async (user, receptionist, res) => {
  try {
    const receptionistWithData = await Receptionist.findOne({
      where: { receptionist_id: receptionist.receptionist_id },
      include: [
        {
          model: Appointment,
          required: false,
          include: [
            {
              model: Patient,
              attributes: ["patient_fname", "patient_lname"],
            },
            {
              model: Doctor,
              attributes: ["doctor_fname", "doctor_lname"],
            },
            {
              model: Office,
              attributes: ["office_name"],
            },
          ],
        },
      ],
    });

    return res.json({
      receptionistInfo: {
        name: `${receptionist.receptionist_fname} ${receptionist.receptionist_lname}`,
        email: user.user_email,
        phone: user.user_phone,
      },
      appointments: receptionistWithData?.Appointments || [],
    });
  } catch (error) {
    console.error("Error in populateDashboardForReceptionist:", error);
    res.status(500).json({
      message: "Error loading receptionist dashboard",
      error: error.message,
    });
  }
};

export default {
  populateDashboard,
};
