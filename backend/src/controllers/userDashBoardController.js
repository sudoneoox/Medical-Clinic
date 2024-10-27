// userDashBoardController.js
import Receptionist from "../models/Tables/Receptionist.js";
import Nurse from "../models/Tables/Nurse.js";
import Doctor from "../models/Tables/Doctor.js";
import Patient from "../models/Tables/Patient.js";
import User from "../models/Tables/Users.js";
import Appointment from "../models/Tables/Appointment.js";
import MedicalRecord from "../models/Tables/MedicalRecord.js";
import Office from "../models/Tables/Office.js";
import PatientDoctor from "../models/Tables/PatientDoctor.js";
import patientDashboard from "./util/patientDashboard.js";
import nurseDashboard from "./util/nurseDashboard.js";
import receptionistDashboard from "./util/receptionistDashboard.js";
import doctorDashboard from "./util/doctorDashboard.js";

// switches depending on role and sidebar item clicked
const portalRoleSwitcher = async (req, res) => {
  try {
    const { user_id, user_role, sidebarItem } = req.body;

    console.log(
      `Received sidebarItem inside portalRoleSwitcher: ${sidebarItem}`,
    );

    const user = await User.findOne({ where: { user_id: user_id } });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user_role.toUpperCase() !== user.user_role) {
      return res.status(401).json({ message: "Mismatching user role" });
    }

    let relatedEntity;
    switch (user.user_role) {
      // NOTE: receptionist seperator
      case "RECEPTIONIST":
        relatedEntity = await Receptionist.findOne({
          where: { user_id: user_id },
        });
        switch (sidebarItem) {
          case "OVERVIEW":
            return await receptionistDashboard.populateOVERVIEW(
              user,
              relatedEntity,
              res,
            );
          case "APPOINTMENTS":
            return await receptionistDashboard.populateAPPOINTMENTS(
              user,
              relatedEntity,
              res,
            );
          case "PATIENTRECORDS":
            return await receptionistDashboard.populatePATIENTRECORDS(
              user,
              relatedEntity,
              res,
            );
          default:
            return res.status(401).json({
              message: `Invalid sidebarItem found in portalRoleSwitcher for receptionist ${sidebarItem}`,
            });
        }
      // NOTE: nurse seperator
      case "NURSE":
        relatedEntity = await Nurse.findOne({ where: { user_id: user_id } });
        switch (sidebarItem) {
          case "OVERVIEW":
            return await nurseDashboard.populateOVERVIEW(
              user,
              relatedEntity,
              res,
            );
          case "PATIENTCARE":
            return await nurseDashboard.populatePATIENTCARE(
              user,
              relatedEntity,
              res,
            );
          case "MEDICATIONS":
            return await nurseDashboard.populateMEDICATION(
              user,
              relatedEntity,
              res,
            );
          default:
            return res.status(401).json({
              message: `Invalid sidebarItem found in portalRoleSwitcher for nurse got ${sidebarItem}`,
            });
        }
      // NOTE: patient seperator
      case "PATIENT":
        relatedEntity = await Patient.findOne({ where: { user_id: user_id } });
        switch (sidebarItem) {
          case "OVERVIEW":
            return await patientDashboard.populateOVERVIEW(
              user,
              relatedEntity,
              res,
            );
          case "CALENDAR":
            return await patientDashboard.populateCALENDAR(
              user,
              relatedEntity,
              res,
            );
          case "MY-APPOINTMENTS":
            return await patientDashboard.populateAPPOINTMENTS(
              user,
              relatedEntity,
              res,
            );
          case "MEDICAL-RECORDS":
            return await patientDashboard.populateMEDICALRECORDS(
              user,
              relatedEntity,
              res,
            );
          default:
            return res.status(401).json({
              message: `Invalid sidebarItem found in portalRoleSwitcher for patient got ${sidebarItem}`,
            });
        }
      // NOTE: doctor seperator
      case "DOCTOR":
        relatedEntity = await Doctor.findOne({ where: { user_id: user_id } });
        switch (sidebarItem) {
          case "OVERVIEW":
            return await doctorDashboard.populateOVERVIEW(
              user,
              relatedEntity,

              res,
            );
          case "CALENDAR":
            return await doctorDashboard.populateCALENDAR(
              user,
              relatedEntity,
              res,
            );
          case "MY-APPOINTMENTS":
            return await doctorDashboard.populateMYAPPOINTMENTS(
              user,
              relatedEntity,
              res,
            );
          case "PATIENTS":
            return await doctorDashboard.populatePATIENTS(
              user,
              relatedEntity,
              res,
            );
          default:
            return res.status(401).json({
              message: `Invalid sidebarItem found in portalRoleSwitcher for doctor got ${sidebarItem}`,
            });
        }
      case "ADMIN":
        // TODO: admin dashboard backend logic
        return res
          .status(401)
          .json({ message: "Admin role not yet implemented" });

      default:
        return res.status(401).json({
          message: `Invalid user_role received inside of userDashBoardController function got ${user_role}`,
        });
    }
  } catch (error) {
    console.error(`Error fetching dashboard data:`, error);
    res
      .status(500)
      .json({ message: "Error fetching dashboard data", error: error.message });
  }
};
export default {
  portalRoleSwitcher,
};
