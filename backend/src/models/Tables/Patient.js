import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";
  const Patient = sequelize.define(
    "Patient",
    {
      patient_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      patient_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      emergency_contacts: {
        type: DataTypes.JSON, // ! Array of EMERGENCY_CONTACT
      },
      primary_doctor_id: {
        type: DataTypes.INTEGER,
      },
      specialized_doctors_id: {
        type: DataTypes.JSON, // ! Array of INTEGER
      },
    },
    {
      tableName: "patient",
      timestamps: false,
    }
  );



export default Patient;
