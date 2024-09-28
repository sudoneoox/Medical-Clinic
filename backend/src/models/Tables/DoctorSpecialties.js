import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";
  const DoctorSpecialties = sequelize.define(
    "DoctorSpecialties",
    {},
    {
      tableName: "doctor_specialties",
      timestamps: false,
    }
  );



export default DoctorSpecialties;