const User = require("./Tables/Users");
const Doctor = require("./Tables/Doctor");
const Patient = require("./Tables/Patient");
const Office = require("./Tables/Office");
const DoctorOffices = require("./Tables/DoctorOffices");
const Insurance = require("./Tables/Insurance");
const AuditLog = require("./Tables/AuditLog");
const MedicalRecord = require("./Tables/MedicalRecord");
const Appointment = require("./Tables/Appointment");
const Prescription = require("./Tables/Prescription");
const SpecialistApproval = require("./Tables/SpecialistApproval");
const Billing = require("./Tables/Billing");

module.exports = {
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
};
