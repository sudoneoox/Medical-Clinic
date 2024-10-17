import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";
const DoctorSpecialties = sequelize.define(
  "DoctorSpecialties",
  {
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    specialty_code: {
      type: DataTypes.TINYINT,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "doctor_specialties",
    timestamps: false,
  }
);

export default DoctorSpecialties;
