import User from "./Tables/Users.js";
import Doctor from "./Tables/Doctor.js";
import Patient from "./Tables/Patient.js";
import Office from "./Tables/Office.js";
import DoctorOffices from "./Tables/DoctorOffices.js";
import Insurance from "./Tables/Insurance.js";
import AuditLog from "./Tables/AuditLog.js";
import MedicalRecord from "./Tables/MedicalRecord.js";
import Appointment from "./Tables/Appointment.js";
import Prescription from "./Tables/Prescription.js";
import SpecialistApproval from "./Tables/SpecialistApproval.js";
import Billing from "./Tables/Billing.js";
import PatientDoctor from "./Tables/PatientDoctor.js";
import Notification from "./Tables/Notification.js";
import RaceCode from "./Tables/RaceCode.js";
import GenderCode from "./Tables/GenderCode.js";
import EthnicityCode from "./Tables/EhtnicityCode.js";
import Demographics from "./Tables/Demographics.js";
import Specialty from "./Tables/Specialties.js";
import Receptionist from "./Tables/Receptionist.js";
import Nurse from "./Tables/Nurse.js";
import NurseOffices from "./Tables/NurseOffices.js";
import AppointmentNotes from "./Tables/AppointmentNotes.js";
import DoctorSpecialties from "./Tables/DoctorSpecialties.js";
import AppointmentCancellations from "./Tables/AppointmentCancellations.js";
import ReceptionistOffices from "./Tables/ReceptionistOffices.js";

const initAssociations = () => {
  // // User associations
  // User.hasOne(Doctor, { foreignKey: "user_id" });
  // User.hasOne(Patient, { foreignKey: "user_id" });
  // User.hasOne(Nurse, { foreignKey: "user_id" });
  // User.hasOne(Receptionist, { foreignKey: "user_id" });
  // User.hasMany(AuditLog, { foreignKey: "changed_by" });
  // User.hasMany(Notification, {
  //   foreignKey: "sender_id",
  //   as: { singular: "sentNotification", plural: "sentNotifications" },
  // });
  // User.hasMany(Notification, {
  //   foreignKey: "receiver_id",
  //   as: { singular: "receivedNotification", plural: "receivedNotifications" },
  // });
  // User.hasOne(Demographics, { foreignKey: "user_id" });

  // // Doctor associations
  // Doctor.belongsTo(User, { foreignKey: "user_id" });
  // Doctor.belongsToMany(Office, {
  //   through: DoctorOffices,
  //   foreignKey: "doctor_id",
  //   otherKey: "office_id",
  //   as: { singular: "office", plural: "offices" },
  // });
  // Doctor.hasMany(Appointment, { foreignKey: "doctor_id" });
  // Doctor.hasMany(MedicalRecord, { foreignKey: "doctor_id" });
  // Doctor.belongsToMany(Specialty, {
  //   through: DoctorSpecialties,
  //   foreignKey: "doctor_id",
  //   otherKey: "specialty_id",
  //   as: { singular: "specialty", plural: "specialties" },
  // });
  // Doctor.belongsToMany(Patient, {
  //   through: PatientDoctor,
  //   foreignKey: "doctor_id",
  //   otherKey: "patient_id",
  //   as: { singular: "patient", plural: "patients" },
  // });
  // Doctor.hasMany(SpecialistApproval, {
  //   foreignKey: "requesting_doctor_id",
  //   as: { singular: "requestedApproval", plural: "requestedApprovals" },
  // });
  // Doctor.hasMany(SpecialistApproval, {
  //   foreignKey: "specialist_id",
  //   as: { singular: "approvedSpecialistRequest", plural: "approvedSpecialistRequests" },
  // });

  // // Patient associations
  // Patient.belongsTo(User, { foreignKey: "user_id" });
  // Patient.belongsToMany(Doctor, {
  //   through: PatientDoctor,
  //   foreignKey: "patient_id",
  //   otherKey: "doctor_id",
  //   as: { singular: "doctor", plural: "doctors" },
  // });
  // Patient.hasMany(Appointment, { foreignKey: "patient_id" });
  // Patient.hasMany(MedicalRecord, { foreignKey: "patient_id" });
  // Patient.hasMany(Insurance, { foreignKey: "patient_id" });
  // Patient.hasMany(SpecialistApproval, { foreignKey: "patient_id" });
  // Patient.hasMany(Billing, { foreignKey: "patient_id" });

  // // Office associations
  // Office.belongsToMany(Doctor, {
  //   through: DoctorOffices,
  //   foreignKey: "office_id",
  //   otherKey: "doctor_id",
  //   as: { singular: "doctor", plural: "doctors" },
  // });
  // Office.belongsToMany(Nurse, {
  //   through: NurseOffices,
  //   foreignKey: "office_id",
  //   otherKey: "nurse_id",
  //   as: { singular: "nurse", plural: "nurses" },
  // });
  // Office.belongsToMany(Receptionist, {
  //   through: ReceptionistOffices,
  //   foreignKey: "office_id",
  //   otherKey: "receptionist_id",
  //   as: { singular: "receptionist", plural: "receptionists" },
  // });
  // Office.hasMany(Appointment, { foreignKey: "office_id" });

  // // Appointment associations
  // Appointment.belongsTo(Patient, { foreignKey: "patient_id" });
  // Appointment.belongsTo(Doctor, { foreignKey: "doctor_id" });
  // Appointment.belongsTo(Office, { foreignKey: "office_id" });
  // Appointment.belongsTo(Receptionist, { foreignKey: "booked_by" });
  // Appointment.belongsTo(Nurse, { foreignKey: "attending_nurse" });
  // Appointment.hasOne(MedicalRecord, { foreignKey: "appointment_id" });
  // Appointment.hasOne(Billing, { foreignKey: "appointment_id" });
  // Appointment.hasMany(AppointmentNotes, { foreignKey: "appointment_id" });
  // Appointment.hasOne(AppointmentCancellations, { foreignKey: "appointment_id" });

  // // MedicalRecord associations
  // MedicalRecord.belongsTo(Patient, { foreignKey: "patient_id" });
  // MedicalRecord.belongsTo(Doctor, { foreignKey: "doctor_id" });
  // MedicalRecord.belongsTo(Appointment, { foreignKey: "appointment_id" });
  // MedicalRecord.hasMany(Prescription, { foreignKey: "record_id" });
  // MedicalRecord.belongsTo(User, { as: "CreatedBy", foreignKey: "created_by" });
  // MedicalRecord.belongsTo(User, { as: "UpdatedBy", foreignKey: "updated_by" });

  // // Billing associations
  // Billing.belongsTo(Patient, { foreignKey: "patient_id" });
  // Billing.belongsTo(Appointment, { foreignKey: "appointment_id" });
  // Billing.belongsTo(User, { as: "HandledBy", foreignKey: "handled_by" });

  // // Insurance associations
  // Insurance.belongsTo(Patient, { foreignKey: "patient_id" });

  // // SpecialistApproval associations
  // SpecialistApproval.belongsTo(Patient, { foreignKey: "patient_id" });
  // SpecialistApproval.belongsTo(Doctor, {
  //   as: { singular: "requestingDoctor", plural: "requestingDoctors" },
  //   foreignKey: "requesting_doctor_id",
  // });
  // SpecialistApproval.belongsTo(Doctor, {
  //   as: { singular: "approvedSpecialist", plural: "approvedSpecialists" },
  //   foreignKey: "specialist_id",
  // });

  // // Nurse associations
  // Nurse.belongsTo(User, { foreignKey: "user_id" });
  // Nurse.belongsToMany(Office, {
  //   through: NurseOffices,
  //   foreignKey: "nurse_id",
  //   otherKey: "office_id",
  //   as: { singular: "office", plural: "offices" },
  // });
  // Nurse.hasMany(Appointment, { foreignKey: "attending_nurse" });

  // // Receptionist associations
  // Receptionist.belongsTo(User, { foreignKey: "user_id" });
  // Receptionist.belongsToMany(Office, {
  //   through: ReceptionistOffices,
  //   foreignKey: "receptionist_id",
  //   otherKey: "office_id",
  //   as: { singular: "office", plural: "offices" },
  // });
  // Receptionist.hasMany(Appointment, { foreignKey: "booked_by" });

  // // AppointmentNotes associations
  // AppointmentNotes.belongsTo(Appointment, { foreignKey: "appointment_id" });
  // AppointmentNotes.belongsTo(Nurse, { foreignKey: "created_by_nurse" });
  // AppointmentNotes.belongsTo(Receptionist, { foreignKey: "created_by_receptionist" });

  // // AppointmentCancellations associations
  // AppointmentCancellations.belongsTo(Appointment, { foreignKey: "appointment_id" });

  // // Demographics associations
  // Demographics.belongsTo(User, { foreignKey: "user_id" });
  // Demographics.belongsTo(RaceCode, { foreignKey: "race" });
  // Demographics.belongsTo(GenderCode, { foreignKey: "gender" });
  // Demographics.belongsTo(EthnicityCode, { foreignKey: "ethnicity" });

  // // Junction table associations
  // DoctorOffices.belongsTo(Doctor, { foreignKey: "doctor_id" });
  // DoctorOffices.belongsTo(Office, { foreignKey: "office_id" });

  // NurseOffices.belongsTo(Nurse, { foreignKey: "nurse_id" });
  // NurseOffices.belongsTo(Office, { foreignKey: "office_id" });

  // ReceptionistOffices.belongsTo(Receptionist, { foreignKey: "receptionist_id" });
  // ReceptionistOffices.belongsTo(Office, { foreignKey: "office_id" });

  // DoctorSpecialties.belongsTo(Doctor, { foreignKey: "doctor_id" });
  // DoctorSpecialties.belongsTo(Specialty, { foreignKey: "specialty_id" });

  // PatientDoctor.belongsTo(Patient, { foreignKey: "patient_id" });
  // PatientDoctor.belongsTo(Doctor, { foreignKey: "doctor_id" });
};

export default initAssociations;
