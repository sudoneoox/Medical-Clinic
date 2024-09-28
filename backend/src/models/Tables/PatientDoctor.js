import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const PatientDoctor = sequelize.define(
    "PatientDoctor",
    {
      is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "patient_doctor",
      timestamps: false,
    }
  );

export default PatientDoctor;