// userDashBoardController.js
import Receptionist from "../models/Tables/Receptionist.js";
import Nurse from "../models/Tables/Nurse.js";
import Doctor from "../models/Tables/Doctor.js";
import Patient from "../models/Tables/Patient.js";
import User from "../models/Tables/Users.js";
import Appointment from "../models/Tables/Appointment.js";
import MedicalRecord from "../models/Tables/MedicalRecord.js";
import Office from "../models/Tables/Office.js";
import PatientDoctor from "../models/Tables/PatientDoctor.js";
import patientDashboard from "./util/patientDashboard.js";

// switches depending on role and sidebar item clicked
const portalRoleSwitcher = async (req, res) => {
  try {
    const { user_id, user_role, sidebarItem } = req.body;

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
        return await populateOVERVIEWForReceptionist(user, relatedEntity, res);

      case "NURSE":
        relatedEntity = await Nurse.findOne({ where: { user_id: user_id } });
        return await populateOVERVIEWForNurse(user, relatedEntity, res);

      case "PATIENT":
        relatedEntity = await Patient.findOne({ where: { user_id: user_id } });
        switch (sidebarItem) {
          case "OVERVIEW":
            return await patientDashboard.populateOVERVIEW(
              user,
              relatedEntity,
              res,
            );
            break;
          case "CALENDAR":
            return await patientDashboard.populateCALENDAR(
              user,
              relatedEntity,
              res,
            );
            break;
          case "MY-APPOINTMENTS":
            return await patientDashboard.populateAPPOINTMENTS(
              user,
              relatedEntity,
              res,
            );
            break;
          case "MEDICAL-RECORDS":
            return await patientDashboard.populateMEDICALRECORDS(
              user,
              relatedEntity,
              res,
            );
            break;
          default:
            return res.status(401).json({
              message: "Invalid sidebarItem not found in portalRoleSwitcher",
            });
        }

      case "DOCTOR":
        relatedEntity = await Doctor.findOne({ where: { user_id: user_id } });
        return await populateOVERVIEWForDoctor(user, relatedEntity, res);

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

const populateOVERVIEWForDoctor = async (user, doctor, res) => {
  try {
    const appointments = await Doctor.findOne({
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

    const patients = await PatientDoctor.findAll({
      where: { doctor_id: doctor.doctor_id },
    });

    return res.json({
      doctorInfo: {
        name: `${doctor.doctor_fname} ${doctor.doctor_lname}`,
        email: user.user_email,
        phone: user.user_phone,
        experience: doctor.years_of_experience,
      },
      appointments: appointments?.appointments || [],
      patients: patients?.patients || [],
    });
  } catch (error) {
    console.error("Error in populateOVERVIEWForDoctor:", error);
    res.status(500).json({
      message: "Error loading doctor dashboard",
      error: error.message,
    });
  }
};

const populateOVERVIEWForNurse = async (user, nurse, res) => {
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
    console.error("Error in populateOVERVIEWForNurse:", error);
    res
      .status(500)
      .json({ message: "Error loading nurse dashboard", error: error.message });
  }
};

const populateOVERVIEWForReceptionist = async (user, receptionist, res) => {
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
    console.error("Error in populateOVERVIEWForReceptionist:", error);
    res.status(500).json({
      message: "Error loading receptionist dashboard",
      error: error.message,
    });
  }
};

export default {
  portalRoleSwitcher,
};
