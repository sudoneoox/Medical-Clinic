import Speciality from "../models/Tables/Specialties.js";

// async function fetchSpecialties() {
//     try {
//       const specialties = await Speciality.findAll({
//         attributes: ['specialty_code', 'specialty_name']
//       });

//       // Convert the results into an array of objects for easier looping
//       const specialtyList = specialties.map(specialty => ({
//         code: specialty.specialty_code,
//         name: specialty.specialty_name
//       }));
  
//       // Log or return the list
//       console.log(specialtyList);
//       return specialtyList;
//     } catch (error) {
//       console.error('Error fetching specialties:', error);
//     }
// }

const fetchSpecialties = async (_req, res) => {
    try {
      console.log('fetchSpecialties function called');
      const specialties = await Speciality.findAll({
        attributes: ['specialty_code', 'specialty_name','specialty_desc']
      });
      console.log('Fetched specialties:', specialties);
      // Convert the results into an array of objects for easier looping
      const specialtyList = specialties.map(specialty => ({
        code: specialty.specialty_code,
        name: specialty.specialty_name,
        desc: specialty.specialty_desc
      }));

      // specialtyList.forEach(specialty => {
      //   console.log(`Code: ${specialty.code}, Name: ${specialty.name}`);
      // });
      // Send the list as JSON response
      res.json(specialtyList);
      // return specialtyList;
  
    } catch (error) {
      console.error('Error fetching specialties:321', error);
      // Send an error response
      res.status(500).json({ error: 'Failed to fetch specialties' });
    }
};
// Get specialities data from getspecialities.js

const Servicesfuncs = {
    fetchSpecialties,
};

export default Servicesfuncs;