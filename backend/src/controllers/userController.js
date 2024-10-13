import User from "../models/Tables/Users.js";
import Demographics from '../models/Tables/Demographics.js'
import RaceCode from '../models/Tables/RaceCode.js'
import GenderCode from '../models/Tables/GenderCode.js'
import EthnicityCode from '../models/Tables/EthnicityCode.js'
import Patient from '../models/Tables/Patient.js'
import Nurse from '../models/Tables/Nurse.js';
import Receptionist from '../models/Tables/Receptionist.js'
import Doctor from '../models/Tables/Doctor.js';
import EmployeeNo from '../models/Tables/ValidEmployeeNo.js';

import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    console.log(req.body);
    
    // get corresponding demographic data
    const raceCode = await RaceCode.findOne({where : {race_text: userData.race}});
    // console.log('found race data ', raceCode.dataValues.race_code);
    const genderCode = await GenderCode.findOne({where : {gender_text: userData.gender}})
    // console.log('found gender data', genderCode);
    const ethnicityCode = await EthnicityCode.findOne({where: {ethnicity_text: userData.ethnicity}});
    // console.log('found ethnicity data', ethnicityCode);
    // crate demographic entry
    const demographic = await Demographics.create({
      ethnicity_id: ethnicityCode.dataValues.ethnicity_code,
      race_id: raceCode.dataValues.race_code,
      gender_id: genderCode.dataValues.gender_code,
      dob: userData.dob,
    });

    // console.log('created demographics table ', demographic)

    // other information
    let userRole = userData.role;
    if(userRole.toUpperCase() === 'PROVIDER'){
      userRole = userData.providerType;
    }
    const userPassword = userData.password;
    const userUsername = userData.username;
    const userPhone = userData.phone;
    const userEmail = userData.email;
    
    // LOGIC: to only allow valid employees to make their accounts
    const empNo = await EmployeeNo.findOne({where: {employee_no: userData.employeeId}});
    console.log("EMPNO: ", empNo);
    if(empNo == null && userRole.toUpperCase() !== "PATIENT"){
        
      if(empNo == null) {
        throw new Error('NOT A VALID EMPLOYEE NO');
      } else if (empNo.employee_role !== user.user_role.toUpperCase()){
        throw new Error("Invalid employee number")
      } else {
        console.log('found valid employee no: ', empNo);
      }
    }
    

    const newUser = await User.create({
      demographics_id: demographic.demographics_id,
      user_role: userRole.toUpperCase(),
      user_email: userEmail,
      user_phone: userPhone,
      user_password: userPassword,
      user_username: userUsername,
    });

    // logic for correctly registering only approved providers
    // create asoociated entity with user   
    let associatedEntity = null;
    switch(userRole.toUpperCase()){
      case 'DOCTOR':
        associatedEntity = await Doctor.create({
          user_id: newUser.user_id,
          doctor_fname: userData.fname,
          doctor_lname: userData.lname,
          doctor_employee_id: empNo.employee_no,
          years_of_experience: userData.yearsOfExperience,
        });
        break;
        case 'NURSE':
        associatedEntity = await Nurse.create({
          user_id: newUser.user_id,
          nurse_fname: userData.fname,
          nurse_lname: userData.lname,
          nurse_employee_id: empNo.employee_no,
          specialization: userData.specialization, 
          years_of_experience: userData.yearsOfExperience
        });
        break;
      case 'RECEPTIONIST':
        associatedEntity = await Receptionist.create({
          user_id: newUser.user_id,
          receptionist_fname: userData.fname,
          receptionist_lname: userData.lname,
          receptionist_employee_id: empNo.employee_no,
        });
        break;
      case 'PATIENT':
        associatedEntity = await Patient.create({
          user_id: newUser.user_id,
          patient_fname: userData.fname,
          patient_lname: userData.lname,
          patient_name: `${userData.firstName} ${userData.lastName}`,
          emergency_contacts: userData.emergencyContacts 
        });
        break;
      default:
        throw new Error('Invalid user role');
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
      console.log(error.errors[1])
      res.status(409).json({ message: `${field1} ${field2} is already taken` });
    } else if (error.message === "NOT A VALID EMPLOYEE NO") {
      res.status(400).json({ message: "Invalid employee number" });
    } else if (error.message === "Valid employee no but not for the correct role") {
      res.status(400).json({ message: "Employee number does not match the specified role" });
    } else {
      res.status(500).json({ message: "Error registering user", error: error.message });
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Find the user by email
    const user = await User.findOne({where:{ user_email:email }});
    console.log('found user: ', user);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }


    //TODO:  Generate a JWT token
    // const token = jwt.sign(
    //   { userId: user._id, role: user.user_role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '1h' }
    // );
    //
    // Fetch associated entity based on user role
    let associatedEntity = null;
    switch (user.user_role) {
      case 'DOCTOR':
        associatedEntity = await Doctor.findOne({ user_id: user.user_id });
        break;
      case 'NURSE':
        associatedEntity = await Nurse.findOne({ user_id: user.user_id });
        break;
      case 'RECEPTIONIST':
        associatedEntity = await Receptionist.findOne({ user_id: user.user_id });
        break;
      case 'PATIENT':
        associatedEntity = await Patient.findOne({ user_id: user.user_id });
        break;
    }


   
    console.log('found associatedEntity: ', associatedEntity)

    res.status(200).json({
      message: "User logged in successfully",
      // token, TODO: implement later?
      userId: user.user_id,
      role: user.user_role,
    });
  } catch (error) {
    console.error(`Error logging in user: ${req.body.email}`, error);
    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error logging in user", error: error.message });
    }
  }
};


const userControllerFuncs = {
  loginUser,
  registerUser,
}

export default userControllerFuncs;
