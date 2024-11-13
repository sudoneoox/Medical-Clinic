// userDashBoardController.js
import Receptionist from "../models/Tables/Receptionist.js";
import Nurse from "../models/Tables/Nurse.js";
import Doctor from "../models/Tables/Doctor.js";
import Patient from "../models/Tables/Patient.js";
import User from "../models/Tables/Users.js";
import Admins from "../models/Tables/Admin.js";
import patientDashboard from "./util/patientDashboard.js";
import nurseDashboard from "./util/nurseDashboard.js";
import receptionistDashboard from "./util/receptionistDashboard.js";
import doctorDashboard from "./util/doctorDashboard.js";
import adminDashboard from "./util/adminDashboard.js";
import defaultDashboard from "./util/defaultDashboard.js";

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
          // TODO : MY-APPOINTMENTS, APPOINTMENTS
          case "APPOINTMENTS":
            return await defaultDashboard.populateMYAPPOINTMENTS(
              user,
              relatedEntity,
              req.body.appointmentData,
              res,
            );
          case "CALENDAR":
            return await receptionistDashboard.populateCALENDAR(
              user,
              relatedEntity,
              res,
            );
          case "RECORDS":
            return await receptionistDashboard.populatePATIENTRECORDS(
              user,
              relatedEntity,
              res,
            );
          case "SETTINGS":
            return await defaultDashboard.updateSETTINGS(
              user,
              relatedEntity,
              { section: req.body.section, data: req.body.data },
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
            return await nurseDashboard.populateMEDICATIONS(
              user,
              relatedEntity,
              res,
            );

          case "CALENDAR":
            return await nurseDashboard.populateCALENDAR(
              user,
              relatedEntity,
              res,
            );
          case "SETTINGS":
            return await defaultDashboard.updateSETTINGS(
              user,
              relatedEntity,
              { section: req.body.section, data: req.body.data },
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
            return await defaultDashboard.populateMYAPPOINTMENTS(
              user,
              relatedEntity,
              req.body.appointmentData,
              res,
            );
          case "MEDICAL-RECORDS":
            return await patientDashboard.populateMEDICALRECORDS(
              user,
              relatedEntity,
              res,
            );

          case "SETTINGS":
            return await defaultDashboard.updateSETTINGS(
              user,
              relatedEntity,
              { section: req.body.section, data: req.body.data },
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
            return await defaultDashboard.populateMYAPPOINTMENTS(
              user,
              relatedEntity,
              req.body.appointmentData,
              res,
            );
          case "PATIENTS":
            return await doctorDashboard.populatePATIENTS(
              user,
              relatedEntity,
              res,
            );
          case "SETTINGS":
            return await defaultDashboard.updateSETTINGS(
              user,
              relatedEntity,
              { section: req.body.section, data: req.body.data },
              res,
            );
          default:
            return res.status(401).json({
              message: `Invalid sidebarItem found in portalRoleSwitcher for doctor got ${sidebarItem}`,
            });
        }
      case "ADMIN":
        relatedEntity = await Admins.findOne({ where: { user_id: user_id } });
        switch (sidebarItem) {
          case "OVERVIEW":
            return await adminDashboard.populateOVERVIEW(
              user,
              relatedEntity,
              res,
            );
          case "USER MANAGEMENT":
            return await adminDashboard.populateUSERMANAGEMENT(
              user,
              relatedEntity,
              req.body.managementData,
              res,
            );
          case "ANALYTICS":
            return await adminDashboard.populateANALYTICS(
              user,
              relatedEntity,
              req.body.analyticData,
              res,
            );

          case "SETTINGS":
            return await defaultDashboard.updateSETTINGS(
              user,
              relatedEntity,
              { section: req.body.section, data: req.body.data },
              res,
            );
          default:
            return res.status(401).json({
              message: `Invalid sidebarItem found in portalRoleSwitcher for admin got ${sidebarItem}`,
            });
        }

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
