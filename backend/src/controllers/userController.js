import User from "../models/Tables/Users.js";
import Demographics from '../models/Tables/Demographics.js'
import RaceCode from '../models/Tables/RaceCode.js'
import GenderCode from '../models/Tables/GenderCode.js'
import EthnicityCode from '../models/Tables/EthnicityCode.js'
import Patient from '../models/Tables/Patient.js'
import Nurse from '../models/Tables/Nurse.js';
import Receptionist from '../models/Tables/Receptionist.js'
import Doctor from '../models/Tables/Doctor.js';


// TODO  also have to add a (doctor, patient, nurse, or receptionist) depending on the user role
// TODO given on the form, and parse out the req for specific data in each?
// TODO also have to parse out the demographic data and associate it to the respecitive codes etc.
// TODO have to link the user with the role they chose with their foreign keys
//








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
    const userRole = userData.role;
    const userPassword = userData.password;
    const userUsername = userData.username;
    const userPhone = userData.phone;
    const userEmail = userData.email;
    

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
    switch(userData.role.toUpperCase()){
      case 'DOCTOR':
        associatedEntity = await Doctor.create({
          user_id: newUser.user_id,
          doctor_name: `${userData.firstName} ${userData.lastName}`,
          doctor_employee_id: userData.employeeId,
          years_of_experience: userData.yearsOfExperience,
        });
        break;
        case 'NURSE':
        associatedEntity = await Nurse.create({
          user_id: newUser.user_id,
          nurse_name: `${userData.firstName} ${userData.lastName}`,
          nurse_employee_id: userData.employeeId,
          specialization: userData.specialization, // Assuming this is provided in the request
          years_of_experience: userData.yearsOfExperience
        });
        break;
      case 'RECEPTIONIST':
        associatedEntity = await Receptionist.create({
          user_id: newUser.user_id,
          receptionist_name: `${userData.firstName} ${userData.lastName}`,
          receptionist_employee_id: userData.employeeId
        });
        break;
      case 'PATIENT':
        associatedEntity = await Patient.create({
          user_id: newUser.user_id,
          patient_name: `${userData.firstName} ${userData.lastName}`,
          emergency_contacts: userData.emergencyContacts // Assuming this is provided as a JSON object
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
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else if (error.code === 11000) {
      // Duplicate key error
      res.status(409).json({ message: "User already exists" });
    } else {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  }
};
export default registerUser;
