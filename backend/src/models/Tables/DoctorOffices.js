import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const DoctorOffices = sequelize.define(
  "DoctorOffices",
  {
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    office_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    shift_start: {
      type: DataTypes.TIME,
    },
    shift_end: {
      type: DataTypes.TIME,
    },
  },
  {
    tableName: "doctor_offices",
    timestamps: false,
  }
);

export default DoctorOffices;
