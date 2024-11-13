import Demographics from "../models/Tables/Demographics.js";
import RaceCode from "../models/Tables/RaceCode.js";
import GenderCode from "../models/Tables/GenderCode.js";
import EthnicityCode from "../models/Tables/EthnicityCode.js";
import Patient from "../models/Tables/Patient.js";
import Nurse from "../models/Tables/Nurse.js";
import Receptionist from "../models/Tables/Receptionist.js";
import Doctor from "../models/Tables/Doctor.js";
import Billing from "../models/Tables/Billing.js";
import EmployeeNo from "../models/Tables/ValidEmployeeNo.js";
import Admins from "../models/Tables/Admin.js";
import User from "../models/Tables/Users.js";
import jwt from "jsonwebtoken";
import Appointment from "../models/Tables/Appointment.js";
import { error } from "console";

const registerUser = async (req, res) => {
  try {
    const userData = req.body;

    // get corresponding demographic data
    const raceCode = await RaceCode.findOne({
      where: { race_text: userData.race },
    });
    const genderCode = await GenderCode.findOne({
      where: { gender_text: userData.gender },
    });
    const ethnicityCode = await EthnicityCode.findOne({
      where: { ethnicity_text: userData.ethnicity },
    });
    // crate demographic entry
    const demographic = await Demographics.create({
      ethnicity_id: ethnicityCode.dataValues.ethnicity_code,
      race_id: raceCode.dataValues.race_code,
      gender_id: genderCode.dataValues.gender_code,
      dob: userData.dob,
    });

    // other information
    let userRole = userData.role;
    if (userRole.toUpperCase() === "PROVIDER") {
      userRole = userData.providerType;
    }
    const userPassword = userData.password;
    const userUsername = userData.username;
    const userPhone = userData.phone;
    const userEmail = userData.email;

    // LOGIC: to only allow valid employees to make their accounts
    const empNo = await EmployeeNo.findOne({
      where: { employee_no: userData.employeeId },
    });
    if (empNo == null && userRole.toUpperCase() !== "PATIENT") {
      if (empNo == null) {
        throw new Error("NOT A VALID EMPLOYEE NO");
      } else if (empNo.employee_role !== user.user_role.toUpperCase()) {
        throw new Error("Invalid employee number");
      }
    }

    const newUser = await User.create({
      demographics_id: demographic.demographics_id,
      user_role: userRole.toUpperCase(),
      user_email: userEmail.toLowerCase(),
      user_phone: userPhone,
      user_password: userPassword,
      user_username: userUsername,
    });

    // logic for correctly registering only approved providers
    // create asoociated entity with user
    let associatedEntity = null;
    switch (userRole.toUpperCase()) {
      case "DOCTOR":
        associatedEntity = await Doctor.create({
          user_id: newUser.user_id,
          doctor_fname: userData.fname,
          doctor_lname: userData.lname,
          doctor_employee_id: empNo.employee_no,
          years_of_experience: userData.yearsOfExperience,
        });
        break;
      case "NURSE":
        associatedEntity = await Nurse.create({
          user_id: newUser.user_id,
          nurse_fname: userData.fname,
          nurse_lname: userData.lname,
          nurse_employee_id: empNo.employee_no,
          specialization: userData.specialization,
          years_of_experience: userData.yearsOfExperience,
        });
        break;
      case "RECEPTIONIST":
        associatedEntity = await Receptionist.create({
          user_id: newUser.user_id,
          receptionist_fname: userData.fname,
          receptionist_lname: userData.lname,
          receptionist_employee_id: empNo.employee_no,
        });
        break;
      case "PATIENT":
        associatedEntity = await Patient.create({
          user_id: newUser.user_id,
          patient_fname: userData.fname,
          patient_lname: userData.lname,
          emergency_contacts: userData.emergencyContacts,
        });
        break;
      default:
        throw new Error("Invalid user role");
    }

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.user_id,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      // Handle unique constraint violations
      const field1 = error.errors[0].path;
      const field2 = error.errors[0].value;
    } else if (error.message === "NOT A VALID EMPLOYEE NO") {
      res.status(400).json({ message: "Invalid employee number" });
    } else if (
      error.message === "Valid employee no but not for the correct role"
    ) {
      res
        .status(400)
        .json({ message: "Employee number does not match the specified role" });
    } else {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  }
};

const JWT_SECRET =
  "adba8f88a5b4a2898b62366a3763837ca6669d9dd5048bb64af0e7717ded0569";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({
      where: { user_email: email.toLowerCase() },
    });

    const validPassword = user.user_password === password ? true : false;
    if (!user) {
      return res.status(401).json({ message: "Email does not exist" });
    }

    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect Password " });
    }

    // Fetch associated entity based on user role
    let associatedEntity = null;
    let entityFullName;
    switch (user.user_role) {
      case "DOCTOR":
        associatedEntity = await Doctor.findOne({
          where: { user_id: user.user_id },
        });
        entityFullName =
          associatedEntity.doctor_fname + " " + associatedEntity.doctor_lname;
        break;
      case "NURSE":
        associatedEntity = await Nurse.findOne({
          where: { user_id: user.user_id },
        });
        entityFullName =
          associatedEntity.nurse_fname + " " + associatedEntity.nurse_lname;
        break;
      case "RECEPTIONIST":
        associatedEntity = await Receptionist.findOne({
          where: { user_id: user.user_id },
        });
        entityFullName =
          associatedEntity.receptionist_fname +
          " " +
          associatedEntity.receptionist_lname;
        break;
      case "PATIENT":
        associatedEntity = await Patient.findOne({
          where: { user_id: user.user_id },
        });
        entityFullName =
          associatedEntity.patient_fname + " " + associatedEntity.patient_lname;
        break;
      case "ADMIN":
        associatedEntity = await Admins.findOne({
          where: { user_id: user.user_id },
        });
        entityFullName =
          associatedEntity.admin_fname + " " + associatedEntity.admin_lname;
        break;
      default:
        console.error("USER ROLE NOT FOUND in loginUSER");
        break;
    }

    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.user_role,
        fullName: entityFullName,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
      userId: user.user_id,
      email: user.user_email,
      role: user.user_role,
      userFullName: entityFullName,
    });
  } catch (error) {
    console.error(`Error logging in user: ${req.body.email}`, error);
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res
        .status(500)
        .json({ message: "Error logging in user", error: error.message });
    }
  }
};

const retrieveAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;

    const appointmentsRecords = await Billing.findAll({
      where: { patient_id: patientId },
    });
    
    if (appointmentsRecords.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments records found for this patient." });
    }

    return res.json(appointmentsRecords);
  } catch (error) {
    console.error("Error fetching appointment data", error);
    return res
      .status(500)
      .json({ message: "Error fetching appointment data", error: error.message });
  }
};

const retreiveBills = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Fetch billing records for the specified patient ID
    const billingRecords = await Billing.findAll({
      where: { patient_id: patientId },
    });

    if (billingRecords.length === 0) {
      return res
        .status(404)
        .json({ message: "No billing records found for this patient." });
    }

    return res.json(billingRecords);
  } catch (error) {
    console.error("Error fetching billing data:", error);
    return res
      .status(500)
      .json({ message: "Error fetching billing data", error: error.message });
  }
};

const submitPayment = async (req, res) => {
  try {
    const { selectedBillingRecord, cardNumber, expirationDate, cvv } = req.body;
    const { billing_id, patient_id } = selectedBillingRecord;

    const billingRecord = await Billing.findOne({
      where: { billing_id: billing_id, patient_id: patient_id },
    });

    if (!billingRecord) {
      return res.status(404).json({ message: "Billing record not found." });
    }

    if (billingRecord.payment_status === "PAID") {
      return res
        .status(400)
        .json({ message: "Payment has already been made." });
    }

    // Update the payment status to 'PAID'
    await billingRecord.update({ payment_status: "PAID" });

    return res.status(200).json({ message: "Payment submitted successfully." });
  } catch (error) {
    console.error("Error submitting payment:", error);
    return res
      .status(500)
      .json({ message: "Error submitting payment", error: error.message });
  }
};

const userControllerFuncs = {
  loginUser,
  registerUser,
  retreiveBills,
  submitPayment,
  retrieveAppointments,//add the function!!!
};

export default userControllerFuncs;
