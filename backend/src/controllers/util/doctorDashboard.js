import Nurse from "../models/Tables/Nurse.js";
import Doctor from "../models/Tables/Doctor.js";
import Patient from "../models/Tables/Patient.js";
import User from "../models/Tables/Users.js";
import Appointment from "../models/Tables/Appointment.js";
import Office from "../models/Tables/Office.js";
import PatientDoctor from "../models/Tables/PatientDoctor.js";

const populateOVERVIEW = async (user, doctor, res) => {
  try {
    const appointments = await Doctor.findOne({
      where: { doctor_id: doctor.doctor_id, user_id: user.user_id },
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

const populateCALENDAR = async (user, doctor, res) => {
  console.log("INSIDE calendar");
};
const populateAPPOINTMENTS = async (user, doctor, res) => {
  console.log("INSIDE appointments");
};
const populatePATIENTS = async (user, doctor, res) => {
  console.log("INSIDE patients");
};

const doctorDasboard = {
  populateOVERVIEW,
  populateCALENDAR,
  populateAPPOINTMENTS,
  populatePATIENTS,
};

export default doctorDasboard;
