import Appointment from "../../models/Tables/Appointment.js";
import Patient from "../../models/Tables/Patient.js";
import Doctor from "../../models/Tables/Doctor.js";
import Office from "../../models/Tables/Office.js";

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

const receptionistDashboard = {
  populateOVERVIEW,
};

export default receptionistDashboard;
