import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const PatientDoctor = sequelize.define(
  "PatientDoctor",
  {
    is_primary: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "patient_doctor_junction",
    timestamps: false,
  },
);

export default PatientDoctor;
