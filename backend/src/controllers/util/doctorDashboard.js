import Appointment from "../../models/Tables/Appointment.js";
import Doctor from "../../models/Tables/Doctor.js";
import Office from "../../models/Tables/Office.js";
import MedicalRecord from "../../models/Tables/MedicalRecord.js";
import Patient from "../../models/Tables/Patient.js";
import PatientDoctor from "../../models/Tables/PatientDoctor.js";
import { log } from "console";


const populateOVERVIEW = async (user, doctor, res) => {
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
  
      return res.json({
        doctorInfo: {
          name: `${doctor.doctor_fname} ${doctor.doctor_lname}`,
          email: user.user_email,
          phone: user.user_phone,
          experience: doctor.years_of_experience,
        },
        appointments: appointments?.appointments || [],
        // patients: patients?.patients || [],
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
    console.log("Running doc calendar")
};

const populateMYAPPOINTMENTS = async (user, doctor, res) => {
    console.log("Running myappointments for doc");
};

const populatePATIENTS = async (user, doctor, res) => {
    console.log("Running Patient list for docs");
    try {
        // const patients = await Doctor.findOne({
        //     where: { doctor_id: doctor.doctor_id },
        // });
        const patients = await Doctor.findOne({
          where: { doctor_id: doctor.doctor_id },
          include: [
              {
                model: Patient,
                attributes: ["patient_id", "patient_fname", "patient_lname"],
                include: [
                    {
                        model: MedicalRecord,
                        attributes: ["record_id", "diagnosis","updated_at","appointment_id"], // Adjust the attributes as needed
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
        // appointments: appointments?.appointments || [],
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

const doctorDashboard =  {
    populateOVERVIEW,
    populateCALENDAR,
    populateMYAPPOINTMENTS,
    populatePATIENTS,
};

export default doctorDashboard;