import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";
const Patient = sequelize.define(
  "Patient",
  {
    patient_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_fname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    patient_lname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    emergency_contacts: {
      type: DataTypes.JSON,
    },
  },
  {
    tableName: "patients",
    timestamps: false,
  },
);
export default Patient;
