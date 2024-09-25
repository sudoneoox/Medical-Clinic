// https://dev.to/projectescape/the-comprehensive-sequelize-cheatsheet-3m1m#relations
// defines all the relations btween the models
import {
  User,
  Doctor,
  Patient,
  Office,
  DoctorOffices,
  Insurance,
  AuditLog,
  MedicalRecord,
  Appointment,
  Prescription,
  SpecialistApproval,
  Billing,
} from './tableExports';

module.exports = function initAssociations() {
  // do associations here based on the .sql files in the database/migrations directory or the ER model in the docs directory

  // ! user associations
  User.hasOne(Doctor, { foreignKey: "user_id" });
  User.hasOne(Patient, { foreignKey: "user_id" });

  // ! doctor associations
  Doctor.belongsTo(User, { foreignKey: "user_id" });

  Doctor.belongsToMany(Office, {
    through: DoctorOffices,
    foreignKey: "doctor_id",
  });

  Doctor.hasMany(Appointment, { foreignKey: "doctor_id" });

  Doctor.hasMany(MedicalRecord, { foreignKey: "doctor_id" });

  Doctor.hasMany(SpecialistApproval, {
    as: "RequestingDoctor",
    foreignKey: "requesting_doctor_id",
  });

  Doctor.hasMany(SpecialistApproval, {
    as: "Specialist",
    foreignKey: "specialist_id",
  });

  // ! Patient associations
  Patient.belongsTo(User, { foreignKey: "user_id" });
  Patient.belongsTo(Doctor, {
    as: "PrimaryDoctor",
    foreignKey: "primary_doctor_id",
  });
  Patient.hasMany(Appointment, { foreignKey: "patient_id" });
  Patient.hasMany(MedicalRecord, { foreignKey: "patient_id" });
  Patient.hasMany(Insurance, { foreignKey: "patient_id" });
  Patient.hasMany(SpecialistApproval, { foreignKey: "patient_id" });
  Patient.hasMany(Billing, { foreignKey: "patient_id" });

  // ! office associations
  Office.belongsToMany(Doctor, {
    through: DoctorOffices,
    foreignKey: "office_id",
  });
  Office.hasMany(Appointment, { foreignKey: "office_id" });

  // ! medical record associations
  MedicalRecord.belongsTo(Patient, { foreignKey: "patient_id" });
  MedicalRecord.belongsTo(Doctor, { foreignKey: "doctor_id" });
  MedicalRecord.belongsTo(Appointment, { foreignKey: "appointment_id" });
  MedicalRecord.hasMany(Prescription, { foreignKey: "record_id" });

  // ! Appointments associations
  Appointment.belongsTo(Patient, { foreignKey: "patient_id" });
  Appointment.belongsTo(Doctor, { foreignKey: "doctor_id" });
  Appointment.belongsTo(Office, { foreignKey: "office_id" });
  Appointment.hasOne(MedicalRecord, { foreignKey: "appointment_id" });
  Appointment.hasOne(Billing, { foreignKey: "appointment_id" });

  // ! insurance associations
  Insurance.belongsTo(Patient, { foreignKey: "patient_id" });

  // ! audit log associations
  AuditLog.belongsTo(User, { foreignKey: "changed_by", as: "ChangedBy" });

  // ! prescriptions associations
  Prescription.belongsTo(MedicalRecord, { foreignKey: "recordId" });

  // ! specialist approval associations
  SpecialistApproval.belongsTo(Patient, { foreignKey: "patient_id" });
  SpecialistApproval.belongsTo(Doctor, {
    as: "RequestingDoctor",
    foreignKey: "requesting_doctor_id",
  });
  SpecialistApproval.belongsTo(Doctor, {
    as: "Specialist",
    foreignKey: "specialist_id",
  });

  // ! billing associations
  Billing.belongsTo(Patient, { foreignKey: "patient_id" });
  Billing.belongsTo(Appointment, { foreignKey: "appointment_id" });
};
