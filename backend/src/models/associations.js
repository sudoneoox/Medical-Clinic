import User from "./Tables/Users.js";
import Doctor from "./Tables/Doctor.js";
import Patient from "./Tables/Patient.js";
import PatientDoctor from "./Tables/PatientDoctor.js";
import SpecialistApproval from "./Tables/SpecialistApproval.js";
import Appointment from "./Tables/Appointment.js";
import Billing from "./Tables/Billing.js";
import Insurance from "./Tables/Insurance.js";
import MedicalRecord from "./Tables/MedicalRecord.js";
import Prescription from "./Tables/Prescription.js";
import Demographics from "./Tables/Demographics.js";
import RaceCode from "./Tables/RaceCode.js";
import GenderCode from "./Tables/GenderCode.js";
import EthnicityCode from "./Tables/EthnicityCode.js";
import Receptionist from "./Tables/Receptionist.js";
import Nurse from "./Tables/Nurse.js";
import Office from "./Tables/Office.js";
import AppointmentNotes from "./Tables/AppointmentNotes.js";
import Specialty from "./Tables/Specialties.js";
import AppointmentCancellations from "./Tables/AppointmentCancellations.js";

const initAssociations = () => {
  // User associations
  User.hasOne(Doctor, {
    foreignKey: { name: "user_id", onDelete: "CASCADE" },
    as: "doctors",
    inverse: { as: "user" },
  });
  User.hasOne(Patient, {
    foreignKey: { name: "user_id", onDelete: "CASCADE" },
    as: "patients",
    inverse: { as: "user" },
  });
  User.hasOne(Nurse, {
    foreignKey: { name: "user_id", onDelete: "CASCADE" },
    as: "nurses",
    inverse: { as: "user" },
  });
  User.hasOne(Receptionist, {
    foreignKey: { name: "user_id", onDelete: "CASCADE" },
    as: "receptionists",
    inverse: { as: "user" },
  });
};

export default initAssociations;
