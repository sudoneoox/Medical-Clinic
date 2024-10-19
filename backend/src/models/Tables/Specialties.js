import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";
import { type } from "os";

const Specialty = sequelize.define(
  "Specialty",
  {
    specialty_code: {
      type: DataTypes.TINYINT,
      allowNull: false,
      primaryKey: true,
    },
    specialty_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
  },{
    specialty_desc: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "specialties_code",
    timestamps: false,
  }
);

export default Specialty;
