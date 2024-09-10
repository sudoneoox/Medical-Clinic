// defines all the relations btween the models
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

module.exports = function initAssociations() {
  // do associations here based on the .sql files in the database/migrations directory or the ER model in the docs directory
  User.hasOne(Doctor, { foreignKey: "user_id" });
};
