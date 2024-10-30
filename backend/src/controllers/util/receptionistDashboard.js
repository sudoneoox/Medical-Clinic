import Appointment from "../../models/Tables/Appointment.js";
import Patient from "../../models/Tables/Patient.js";
import Doctor from "../../models/Tables/Doctor.js";
import Billing from "../../models/Tables/Billing.js";
import Office from "../../models/Tables/Office.js";
import Receptionist from "../../models/Tables/Receptionist.js";

const populateOVERVIEW = async (user, receptionist, res) => {
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

const populateAPPOINTMENTS = async (user, receptionist, res) => {
  console.log("INSIDE receptionist populateAPPOINTMENTS");
};

const populatePATIENTRECORDS = async (user, receptionist, res) => {
  try {
    console.log("INSIDE receptionist populatePATIENTRECORDS");

    const receptionistData = await Receptionist.findOne({
      where: { receptionist_id: receptionist.receptionist_id },
      include: [
        {
          model: Office, 
          attributes: ["office_id"],
          required: true,
        },
      ],
    });
    const officeIds = receptionistData?.offices?.map(office => office.office_id) || []; // Get the office ID

    const doctors = await Doctor.findAll({
      include: [
        {
          model: Office,
          where: { office_id: officeIds[0] },
        },
        {
          model: Patient,
          attributes: ["patient_fname", "patient_lname", "patient_id"],
          required: true,
        },
      ],
    });

    const patients = doctors.flatMap(doctor => doctor.patients || []);

    return res.json({
      patients,
    });
  } catch (error) {
    console.error("Error in populatePatientsForClinic:", error);
    res.status(500).json({
      message: "Error loading patients for the clinic",
      error: error.message,
    });
  }
};
const receptionistDashboard = {
  populateOVERVIEW,
  populateAPPOINTMENTS,
  populatePATIENTRECORDS,
};

export default receptionistDashboard;
