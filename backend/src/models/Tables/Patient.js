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
      type: DataTypes.JSON,
    },
  },
  {
    tableName: "patients",
    timestamps: false,
  }
);
export default Patient;
