import Receptionist from '../models/Tables/Receptionist.js'
// import Admin from '../models/Tables/Admin.js'
import Nurse from '../models/Tables/Nurse.js'
import Doctor from '../models/Tables/Doctor.js'
import Patient from '../models/Tables/Patient.js'
import User from '../models/Tables/Users.js'

const populateDashboard = async (req, res) => {
try {
    const {user_id, user_role} = req.body;
    console.log('received from populateDashboard: ', user_id, user_role );
    
    // find user by appropriate userid
    const user = await User.findOne({where: {user_id:  user_id}})
    if(!user){
      console.error('Could not fetch user_id from within populateDashboard\n the local storage token might be wrong?')
      // TODO: in the frontend either fix the localstorage token or sign them out and make them sign back in 
      return res.status(401).json({ message: "issue with populating the dashboard" });
    } else if (user_role.toUpperCase() !== user.user_role){
      console.error(`The provided user_role from the local storage is the matching with the send user_role\n trying to fit mismatching user_role
        data into the dashboard is not going to work`);
      // TODO: this is something for frontend they could be handling the localstorage token wrong  if it got to this
      return res.status(401).json({message: "mismatching user_role and user_id in the populateDashboard function"})
    }

    // TODO: either make the subfunctions in this switch case return the json response back idk if thats allowed or if
    // return await is either valid or make the subfunctions return a json datatype and then make this master function return that
    // to the frontend
    let relatedEntityType;
    switch (user.user_role) {
      case "RECEPTIONIST": 
        relatedEntityType = await Receptionist.findOne({where:{user_id: user_id}});
        return await populateDashboardForReceptionist(user, receptionist);
        break;
      case "ADMIN":
        // return await populateDashboardForAdmin();
        // relatedEntityType = await Admin.findOne({where:{user_id: user_id}});
        // relatedEntityType === null ? (return res.status(401).json({message: 'error could not find related subentity type within populateDashboard '})):(true);
        return res.status(401).json({message: "TODO admin role is not yet implemented within the backend or the database"});
        break;
      case "NURSE":
        relatedEntityType = await Nurse.findOne({where:{user_id: user_id}});
        return await populateDashboardForNurse(user, nurse);
        break;
      case "PATIENT":
        relatedEntityType = await Patient.findOne({where:{user_id: user_id}});
        return await populateDashboardForPatient(user, patient);
        break;
      case "DOCTOR":
        relatedEntityType = await Doctor.findOne({where:{user_id: user_id}});
        return await populateDashboardForDoctor(user, doctor);
        break;
      default:
        console.error("Could not find a valid user_role ")
        return res.status(401).json({message: `provided user_role in the populteDashboard function does not match any valid roles within the database`})
        break;
    }
  }
 catch (error) {
    //TODO: handle different errors that might be encountered
    console.error(`Error fetching dashboard data: ${req.body}`, error);
    if (error.name === ""){
    } else {
      res
        .status(500)
        .json({ message: "Error: ", error: error.message });
    }
  }
}


//TODO: complete subfunctions based on what frontend is going to showcase for each role

const populateDashboardForPatient = (user, patient) =>{

}
const populateDashboardForAdmin = (user, admin) =>{

} 
const populateDashboardForDoctor = (user, doctor) =>{

}

const populateDashboardForReceptionist = (user, receptionist) =>{

}

const populateDashboardForNurse = (user, nurse) =>{

}




const dashBoardControllerFuncs = {
  populateDashboard,
}

export default dashBoardControllerFuncs;


