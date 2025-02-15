import express from "express";
import userControllerFuncs from "../controllers/userController.js";
import dashBoardControllerFuncs from "../controllers/userDashBoardController.js";
import doctorDashboard from "../controllers/util/doctorDashboard.js";
import defaultDashboard from "../controllers/util/defaultDashboard.js";
import adminDashboard from "../controllers/util/adminDashboard.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nurseDashboard from "../controllers/util/nurseDashboard.js";
import receptionistDashboard from "../controllers/util/receptionistDashboard.js";
import patientDashboard from "../controllers/util/patientDashboard.js";

dotenv.config();
const JWT_SECRET =
  "adba8f88a5b4a2898b62366a3763837ca6669d9dd5048bb64af0e7717ded0569";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "no token provided" });
    console.error("error in verifyToken token");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Invalid Token" });
  }
};

const router = express.Router();

router.post("/register", userControllerFuncs.registerUser);
router.post("/login", userControllerFuncs.loginUser);
router.post("/portal/analytics", dashBoardControllerFuncs.portalRoleSwitcher);
router.post("/portal/management", dashBoardControllerFuncs.portalRoleSwitcher);
router.post("/portal/settings", dashBoardControllerFuncs.portalRoleSwitcher);
router.post("/portal/management/delete", adminDashboard.deleteUser);
router.post("/portal/users", dashBoardControllerFuncs.portalRoleSwitcher);
router.post("/portal/overview", dashBoardControllerFuncs.portalRoleSwitcher);
router.post("/portal/calendar", dashBoardControllerFuncs.portalRoleSwitcher);
router.post(
  "/portal/medical-records",
  dashBoardControllerFuncs.portalRoleSwitcher,
);

router.post(
  "/portal/my-appointments",
  dashBoardControllerFuncs.portalRoleSwitcher,
);
router.post(
  "/portal/deleteAppointments/:appointment_id",
  patientDashboard.deleteAppointments,
);

router.post("/portal/patients", dashBoardControllerFuncs.portalRoleSwitcher); // for doc

router.post(
  "/medicalrecords/:patientId",
  doctorDashboard.retrieveMedicalRecords,
);

router.post("/createmedicalrecords", doctorDashboard.addMedicalRecord);

router.post("/editmedicalrecords/:recordId", doctorDashboard.editMedicalRecord);

router.post(
  "/deletemedicalrecord/:recordId",
  doctorDashboard.deleteMedicalRecord,
);

router.post("/newprescription", doctorDashboard.addPrescription);

router.post(
  "/editprescription/:prescriptionId",
  doctorDashboard.editPrescription,
);
router.post(
  "/deleteprescriptionrecord/:prescriptionId",
  doctorDashboard.deletePrescription,
);

router.post(
  "/getallergyrecords/:recordId",
  doctorDashboard.retrieveAllergyRecords,
);

router.post(
  "/newallergy",
  doctorDashboard.addAllergy,
);

router.post(
  "/updateallergy/:allergyId",
  doctorDashboard.editAllergy,
);

router.post(
  "/portal/submitNewAppointment",
  defaultDashboard.submitNewAppointment,
);
router.post(
  "/portal/handleSpecialistApproval",
  defaultDashboard.handleSpecialistApproval,
);

router.post(
  "/portal/requestSpecialistApproval",
  defaultDashboard.requestSpecialistApproval,
);
router.post("/portal/getPrimaryDoctor", defaultDashboard.getPrimaryDoctor);

router.post(
  "/prescriptionrecords/:recordId",
  doctorDashboard.retrievePrescriptionRecords,
);

router.post("/records", dashBoardControllerFuncs.portalRoleSwitcher); // for patient records
router.post("/appointments", dashBoardControllerFuncs.portalRoleSwitcher);
router.post("/getpatients", receptionistDashboard.getPatients);

router.post(
  "/portal/recappointments/forpatient",
  receptionistDashboard.retrieveAppointmentsForPatient,
);

router.post(
  "/receptionist/cancelAppointment",
  receptionistDashboard.cancelAppointment,
);

router.post("/billing/:patientId", userControllerFuncs.retreiveBills);

router.post("/submit-payment", userControllerFuncs.submitPayment);
router.post("/portal/analytics/details", adminDashboard.getAnalyticsDetails);
router.post("/validate-session", verifyToken, (req, res) => {
  // if middlewaire verifyToken didnt fail return success
  res.json({ message: "Session valid" });
});

// nurse
router.post("/portal/nurse/appointments", nurseDashboard.getNurseAppointments);
router.put(
  "/portal/nurse/appointments/:appointmentId/status",
  nurseDashboard.updateAppointmentStatus,
);
router.post(
  "/portal/nurse/appointments/:appointmentId/notes",
  nurseDashboard.addAppointmentNote,
);
router.put(
  "/portal/nurse/appointments/notes/:noteId",
  nurseDashboard.editAppointmentNote,
);

router.put(
  "/portal/nurse/appointments/:appointmentId/status",
  nurseDashboard.updateAppointmentStatus,
);
router.post(
  "/portal/nurse/appointments/:appointmentId/notes",
  nurseDashboard.addAppointmentNote,
);
router.put(
  "/portal/nurse/appointments/notes/:noteId",
  nurseDashboard.editAppointmentNote,
);
router.post(
  "/portal/nurse/appointments/getUnpaidAppointments",
  nurseDashboard.getNurseAppointmentsBilling,
);

router.post("/portal/nurse/billing/create", nurseDashboard.createBills);

router.post("/portal/nurse/allergies", nurseDashboard.getAllergies);
router.post("/portal/nurse/prescriptions", nurseDashboard.getPrescriptions);
router.post("/portal/nurse/medical-records", nurseDashboard.getMedicalRecords);

export default router;
