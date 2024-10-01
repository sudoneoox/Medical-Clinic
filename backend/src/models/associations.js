// import User from "./Tables/Users.js";
// import Doctor from "./Tables/Doctor.js";
// import Patient from "./Tables/Patient.js";
// import PatientDoctor from "./Tables/PatientDoctor.js";
// import SpecialistApproval from "./Tables/SpecialistApproval.js";
// import Appointment from "./Tables/Appointment.js";
// import Billing from "./Tables/Billing.js";
// import Insurance from "./Tables/Insurance.js";
// import MedicalRecord from "./Tables/MedicalRecord.js";
// import Prescription from "./Tables/Prescription.js";
// import AuditLog from "./Tables/AuditLog.js";
// import Demographics from "./Tables/Demographics.js";
// import RaceCode from "./Tables/RaceCode.js";
// import GenderCode from "./Tables/GenderCode.js";
// import EthnicityCode from "./Tables/EthnicityCode.js";
// import Receptionist from "./Tables/Receptionist.js";
// import Nurse from "./Tables/Nurse.js";
// import Office from "./Tables/Office.js";
// import AppointmentNotes from "./Tables/AppointmentNotes.js";
// import Specialty from "./Tables/Specialties.js";
// import AppointmentCancellations from "./Tables/AppointmentCancellations.js";

// const initAssociations = () => {
//   // User associations
//   User.hasOne(Doctor, {
//     foreignKey: { name: "user_id", onDelete: "CASCADE" },
//     as: "doctor",
//     inverse: { as: "user" }
//   });
//   User.hasOne(Patient, {
//     foreignKey: { name: "user_id", onDelete: "CASCADE" },
//     as: "patient",
//     inverse: { as: "user" }
//   });
//   User.hasOne(Nurse, {
//     foreignKey: { name: "user_id", onDelete: "CASCADE" },
//     as: "nurse",
//     inverse: { as: "user" }
//   });
//   User.hasOne(Receptionist, {
//     foreignKey: { name: "user_id", onDelete: "CASCADE" },
//     as: "receptionist",
//     inverse: { as: "user" }
//   });
//   User.hasMany(AuditLog, {
//     foreignKey: { name: "changed_by", onDelete: "SET NULL" },
//     as: "auditLogs"
//   });

//   // Doctor associations
//   Doctor.hasMany(Patient, {
//     foreignKey: { name: "primary_doctor_id", onDelete: "SET NULL" },
//     as: "primaryPatients",
//     inverse: { as: "primaryDoctor" }
//   });
//   Doctor.belongsToMany(Patient, {
//     through: PatientDoctor,
//     foreignKey: "doctor_id",
//     as: "patients"
//   });
//   Doctor.hasMany(SpecialistApproval, {
//     foreignKey: { name: "requesting_doctor_id", onDelete: "CASCADE" },
//     as: "requestedApprovals",
//     inverse: { as: "requestingDoctor" }
//   });
//   Doctor.hasMany(SpecialistApproval, {
//     foreignKey: { name: "specialist_id", onDelete: "CASCADE" },
//     as: "specialistApprovals",
//     inverse: { as: "specialist" }
//   });
//   Doctor.hasMany(Appointment, {
//     foreignKey: { name: "doctor_id", onDelete: "CASCADE" },
//     as: "appointments",
//     inverse: { as: "doctor" }
//   });
//   Doctor.hasMany(MedicalRecord, {
//     foreignKey: { name: "doctor_id", onDelete: "CASCADE" },
//     as: "medicalRecords",
//     inverse: { as: "doctor" }
//   });
//   Doctor.belongsToMany(Office, {
//     through: "doctor_offices",
//     foreignKey: "doctor_id",
//     as: "offices"
//   });
//   Doctor.belongsToMany(Specialty, {
//     through: "doctor_specialties",
//     foreignKey: "doctor_id",
//     as: "specialties"
//   });

//   // Patient associations
//   Patient.hasMany(SpecialistApproval, {
//     foreignKey: { name: "patient_id", onDelete: "CASCADE" },
//     as: "specialistApprovals",
//     inverse: { as: "patient" }
//   });
//   Patient.hasMany(Appointment, {
//     foreignKey: { name: "patient_id", onDelete: "CASCADE" },
//     as: "appointments",
//     inverse: { as: "patient" }
//   });
//   Patient.hasMany(Billing, {
//     foreignKey: { name: "patient_id", onDelete: "CASCADE" },
//     as: "billings",
//     inverse: { as: "patient" }
//   });
//   Patient.hasMany(Insurance, {
//     foreignKey: { name: "patient_id", onDelete: "CASCADE" },
//     as: "insurances",
//     inverse: { as: "patient" }
//   });
//   Patient.hasMany(MedicalRecord, {
//     foreignKey: { name: "patient_id", onDelete: "CASCADE" },
//     as: "medicalRecords",
//     inverse: { as: "patient" }
//   });

//   // Appointment associations
//   Appointment.belongsTo(Patient, {
//     foreignKey: { name: "patient_id" },
//     as: "patient"
//   });
//   Appointment.belongsTo(Doctor, {
//     foreignKey: { name: "doctor_id" },
//     as: "doctor"
//   });
//   Appointment.belongsTo(Receptionist, {
//     foreignKey: { name: "booked_by" },
//     as: "bookedBy"
//   });
//   Appointment.belongsTo(Nurse, {
//     foreignKey: { name: "attending_nurse" },
//     as: "attendingNurse"
//   });
//   Appointment.hasOne(Billing, {
//     foreignKey: { name: "appointment_id", onDelete: "CASCADE" },
//     as: "billing",
//     inverse: { as: "appointment" }
//   });
//   Appointment.hasOne(MedicalRecord, {
//     foreignKey: { name: "appointment_id", onDelete: "SET NULL" },
//     as: "medicalRecord",
//     inverse: { as: "appointment" }
//   });
//   Appointment.hasMany(AppointmentNotes, {
//     foreignKey: { name: "appointment_id", onDelete: "CASCADE" },
//     as: "notes",
//     inverse: { as: "appointment" }
//   });
//   Appointment.hasOne(AppointmentCancellations, {
//     foreignKey: { name: "appointment_id", onDelete: "CASCADE" },
//     as: "cancellation",
//     inverse: { as: "appointment" }
//   });

//   // Billing associations
//   Billing.belongsTo(Patient, {
//     foreignKey: { name: "patient_id" },
//     as: "patient"
//   });
//   Billing.belongsTo(Appointment, {
//     foreignKey: { name: "appointment_id" },
//     as: "appointment"
//   });
//   Billing.belongsTo(User, {
//     foreignKey: { name: "handled_by" },
//     as: "handledBy"
//   });

//   // Insurance associations
//   Insurance.belongsTo(Patient, {
//     foreignKey: { name: "patient_id" },
//     as: "patient"
//   });

//   // Medical Record associations
//   MedicalRecord.belongsTo(Patient, {
//     foreignKey: { name: "patient_id" },
//     as: "patient"
//   });
//   MedicalRecord.belongsTo(Doctor, {
//     foreignKey: { name: "doctor_id" },
//     as: "doctor"
//   });
//   MedicalRecord.belongsTo(Appointment, {
//     foreignKey: { name: "appointment_id" },
//     as: "appointment"
//   });
//   MedicalRecord.belongsTo(User, {
//     foreignKey: { name: "created_by" },
//     as: "createdBy"
//   });
//   MedicalRecord.belongsTo(User, {
//     foreignKey: { name: "updated_by" },
//     as: "updatedBy"
//   });
//   MedicalRecord.hasMany(Prescription, {
//     foreignKey: { name: "record_id", onDelete: "CASCADE" },
//     as: "prescriptions",
//     inverse: { as: "medicalRecord" }
//   });

//   // Demographics associations
//   Demographics.belongsTo(User, {
//     foreignKey: { name: "user_id" },
//     as: "user"
//   });
//   Demographics.belongsTo(RaceCode, {
//     foreignKey: { name: "race" },
//     as: "raceCode"
//   });
//   Demographics.belongsTo(GenderCode, {
//     foreignKey: { name: "gender" },
//     as: "genderCode"
//   });
//   Demographics.belongsTo(EthnicityCode, {
//     foreignKey: { name: "ethnicity" },
//     as: "ethnicityCode"
//   });

//   // Receptionist associations
//   Receptionist.belongsTo(User, {
//     foreignKey: { name: "user_id" },
//     as: "user"
//   });
//   Receptionist.belongsToMany(Office, {
//     through: "receptionist_offices",
//     foreignKey: "receptionist_id",
//     as: "offices"
//   });

//   // Nurse associations
//   Nurse.belongsTo(User, {
//     foreignKey: { name: "user_id" },
//     as: "user"
//   });
//   Nurse.belongsToMany(Office, {
//     through: "nurse_offices",
//     foreignKey: "nurse_id",
//     as: "offices"
//   });

//   // Office associations
//   Office.belongsToMany(Doctor, {
//     through: "doctor_offices",
//     foreignKey: "office_id",
//     as: "doctors"
//   });
//   Office.belongsToMany(Nurse, {
//     through: "nurse_offices",
//     foreignKey: "office_id",
//     as: "nurses"
//   });
//   Office.belongsToMany(Receptionist, {
//     through: "receptionist_offices",
//     foreignKey: "office_id",
//     as: "receptionists"
//   });

//   // AppointmentNotes associations
//   AppointmentNotes.belongsTo(Appointment, {
//     foreignKey: { name: "appointment_id" },
//     as: "appointment"
//   });
//   AppointmentNotes.belongsTo(Nurse, {
//     foreignKey: { name: "created_by_nurse" },
//     as: "createdByNurse"
//   });
//   AppointmentNotes.belongsTo(Receptionist, {
//     foreignKey: { name: "created_by_receptionist" },
//     as: "createdByReceptionist"
//   });

//   // Specialty associations
//   Specialty.belongsToMany(Doctor, {
//     through: "doctor_specialties",
//     foreignKey: "specialty_id",
//     as: "doctors"
//   });
// };

// export default initAssociations;