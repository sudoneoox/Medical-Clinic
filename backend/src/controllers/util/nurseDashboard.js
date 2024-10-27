import Nurse from "../../models/Tables/Nurse.js";
import Doctor from "../../models/Tables/Doctor.js";
import Patient from "../../models/Tables/Patient.js";
import User from "../../models/Tables/Users.js";
import Appointment from "../../models/Tables/Appointment.js";
import Office from "../../models/Tables/Office.js";

const populateOVERVIEW = async (user, nurse, res) => {
  try {
    const nurseWithData = await Nurse.findOne({
      where: { nurse_id: nurse.nurse_id, user_id: user.user_id },
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

const populatePATIENTCARE = async (user, nurse, res) => {
  console.log("INSIDE nurse Patient care");
};

const populateMEDICATIONS = async (user, nurse, res) => {
  console.log("INSIDE nurse medications");
};

const nurseDashboard = {
  populateOVERVIEW,
  populatePATIENTCARE,
  populateMEDICATIONS,
};

export default nurseDashboard;
