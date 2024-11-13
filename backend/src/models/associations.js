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
import Allergies from "./Tables/Allergies.js";
import AppointmentReminders from "./Tables/AppointmentReminders.js";
import TestResults from "./Tables/TestResults.js";
import DoctorOffices from "./Tables/DoctorOffices.js";
import NurseOffices from "./Tables/NurseOffices.js";
import ReceptionistOffices from "./Tables/ReceptionistOffices.js";
import DoctorSpecialties from "./Tables/DoctorSpecialties.js";
import EmployeeNo from "./Tables/ValidEmployeeNo.js";
import Admins from "./Tables/Admin.js";
import Notifs from "./Tables/Notifs.js";
import MedicalRecordNotes from "./Tables/MedicalRecordNotes.js";
import DoctorAvailibility from "./Tables/AvailableDoctors.js";
import TimeSlots from "./Tables/TimeSlots.js";

const initAssociations = () => {
  User.hasOne(Doctor, {
    foreignKey: { name: "user_id", onDelete: "CASCADE" },
    as: "doctor",
  });
  User.hasOne(Patient, {
    foreignKey: { name: "user_id", onDelete: "CASCADE" },
    as: "patient",
  });
  User.hasOne(Nurse, {
    foreignKey: { name: "user_id", onDelete: "CASCADE" },
    as: "nurse",
  });
  User.hasOne(Receptionist, {
    foreignKey: { name: "user_id", onDelete: "CASCADE" },
    as: "receptionist",
  });
  Demographics.hasOne(User, {
    foreignKey: { name: "demographics_id", onDelete: "CASCADE" },
    as: "demographics",
  });
  User.hasOne(Admins, {
    foreignKey: { name: "user_id", onDelete: "CASCADE" },
    as: "admins",
  });

  // Demographics associations
  Demographics.belongsTo(RaceCode, { foreignKey: "race_id", as: "raceCode" });
  Demographics.belongsTo(GenderCode, {
    foreignKey: "gender_id",
    as: "genderCode",
  });
  Demographics.belongsTo(EthnicityCode, {
    foreignKey: "ethnicity_id",
    as: "ethnicityCode",
  });
  // // Doctor associations
  Doctor.belongsToMany(Patient, {
    through: PatientDoctor,
    foreignKey: "doctor_id",
    otherKey: "patient_id",
  });
  Doctor.belongsToMany(Office, {
    through: DoctorOffices,
    foreignKey: "doctor_id",
    otherKey: "office_id",
  });
  Doctor.hasMany(Appointment, { foreignKey: "doctor_id" });
  Doctor.hasMany(MedicalRecord, { foreignKey: "doctor_id" });

  // ! THESE TWO COMMENTED BLOCKS GIVE ERRORS??
  Doctor.hasMany(SpecialistApproval, {
    foreignKey: "reffered_doctor_id",
    // as: "referredApprovals",
  });

  Doctor.belongsToMany(Specialty, {
    through: DoctorSpecialties,
    foreignKey: "doctor_id",
    otherKey: "specialty_code",
  });

  // Patient associations
  Patient.belongsToMany(Doctor, {
    through: PatientDoctor,
    foreignKey: "patient_id",
    otherKey: "doctor_id",
  });
  Patient.hasMany(Appointment, { foreignKey: "patient_id" });
  Patient.hasMany(MedicalRecord, { foreignKey: "patient_id" });
  Patient.hasMany(SpecialistApproval, { foreignKey: "patient_id" });
  Patient.hasMany(Billing, { foreignKey: "patient_id" });
  Patient.hasMany(Insurance, { foreignKey: "patient_id" });

  // Office associations
  Office.belongsToMany(Doctor, {
    through: DoctorOffices,
    foreignKey: "office_id",
    otherKey: "doctor_id",
  });
  Office.belongsToMany(Nurse, {
    through: NurseOffices,
    foreignKey: "office_id",
    otherKey: "nurse_id",
  });
  Office.belongsToMany(Receptionist, {
    through: ReceptionistOffices,
    foreignKey: "office_id",
    otherKey: "receptionist_id",
  });
  Office.hasMany(Appointment, { foreignKey: "office_id" });

  // Nurse associations
  Nurse.belongsToMany(Office, {
    through: NurseOffices,
    foreignKey: "nurse_id",
    otherKey: "office_id",
  });
  Nurse.hasMany(Appointment, { foreignKey: "attending_nurse" });
  Nurse.hasMany(TestResults, { foreignKey: "test_performed_by" });
  Nurse.hasMany(AppointmentNotes, { foreignKey: "created_by_nurse" });

  // Receptionist associations
  Receptionist.belongsToMany(Office, {
    through: ReceptionistOffices,
    foreignKey: "receptionist_id",
    otherKey: "office_id",
  });
  Receptionist.hasMany(Appointment, { foreignKey: "booked_by" });
  Receptionist.hasMany(Billing, { foreignKey: "handled_by" });
  Receptionist.hasMany(AppointmentNotes, {
    foreignKey: "created_by_receptionist",
  });

  // Appointment associations
  Appointment.belongsTo(Patient, { foreignKey: "patient_id" });
  Appointment.belongsTo(Doctor, { foreignKey: "doctor_id" });
  Appointment.belongsTo(Office, { foreignKey: "office_id" });
  Appointment.belongsTo(Receptionist, { foreignKey: "booked_by" });
  Appointment.belongsTo(Nurse, { foreignKey: "attending_nurse" });
  Appointment.hasOne(MedicalRecord, { foreignKey: "appointment_id" });
  Appointment.hasOne(Billing, { foreignKey: "appointment_id" });
  Appointment.hasMany(AppointmentNotes, { foreignKey: "appointment_id" });
  AppointmentNotes.belongsTo(Nurse, {
    foreignKey: "created_by_nurse",
    as: "nurse",
  });
  Appointment.hasOne(AppointmentCancellations, {
    foreignKey: "appointment_id",
  });
  Appointment.hasMany(AppointmentReminders, { foreignKey: "appointment_id" });

  // MedicalRecord associations
  MedicalRecord.belongsTo(Patient, { foreignKey: "patient_id" });
  MedicalRecord.belongsTo(Doctor, { foreignKey: "doctor_id" });
  MedicalRecord.belongsTo(Appointment, { foreignKey: "appointment_id" });
  MedicalRecord.hasOne(Prescription, { foreignKey: "medical_record_id" });
  MedicalRecord.hasMany(MedicalRecordNotes, {
    foreignKey: "medical_record_id",
  });
  MedicalRecord.hasMany(TestResults, { foreignKey: "medical_record_id" });
  MedicalRecord.hasMany(Allergies, { foreignKey: "medical_record_id" });

  // Other associations
  Specialty.belongsToMany(Doctor, {
    through: DoctorSpecialties,
    foreignKey: "specialty_code",
    otherKey: "doctor_id",
  });

  SpecialistApproval.belongsTo(Patient, { foreignKey: "patient_id" });
  SpecialistApproval.belongsTo(Appointment, {
    foreignKey: { name: "appointment_id", onDelete: "CASCADE" },
  });
  SpecialistApproval.belongsTo(Doctor, {
    foreignKey: "reffered_doctor_id",
    as: "referringDoctor",
  });
  SpecialistApproval.belongsTo(Doctor, {
    foreignKey: "specialist_id",
    as: "specialist",
  });
  Billing.belongsTo(Patient, { foreignKey: "patient_id" });
  Billing.belongsTo(Appointment, { foreignKey: "appointment_id" });
  Billing.belongsTo(Receptionist, { foreignKey: "handled_by" });

  Doctor.belongsTo(EmployeeNo, {
    foreignKey: { name: "doctor_employee_id", onDelete: "CASCADE" },
  });
  Nurse.belongsTo(EmployeeNo, {
    foreignKey: { name: "nurse_employee_id", onDelete: "CASCADE" },
  });
  Receptionist.belongsTo(EmployeeNo, {
    foreignKey: { name: "receptionist_employee_id", onDelete: "CASCADE" },
  });

  Admins.belongsTo(EmployeeNo, {
    foreignKey: { name: "admin_employee_id", onDelete: "CASCADE" },
  });

  Notifs.belongsTo(User, {
    foreignKey: { name: "sender_id", onDelete: "CASCADE" },
    as: "sender",
  });
  Notifs.belongsTo(User, {
    foreignKey: { name: "receiver_id", onDelete: "CASCADE" },
    as: "receiver",
  });
  DoctorAvailibility.belongsTo(Doctor, {
    foreignKey: { name: "doctor_id", onDelete: "CASCADE" },
  });

  DoctorAvailibility.belongsTo(Office, {
    foreignKey: { name: "office_id", onDelete: "CASCADE" },
  });
  DoctorAvailibility.belongsTo(TimeSlots, {
    foreignKey: { name: "slot_id", onDelete: "CASCADE" },
  });
  Doctor.belongsTo(DoctorAvailibility, {
    foreignKey: { name: "doctor_id", onDelete: "CASCADE" },
  });
};

export default initAssociations;
