import Speciality from "../models/Tables/Specialties.js";

const fetchSpecialties = async (req, res) => {
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

     // Send the list as JSON response
      res.json(specialtyList);
      // return specialtyList;
  
    } catch (error) {
      console.error('Error fetching specialties:321', error);
      // Send an error response
      res.status(500).json({ error: 'Failed to fetch specialties' });
    }
};

const ServicesFuncs = {
    fetchSpecialties,
};

export default ServicesFuncs;
