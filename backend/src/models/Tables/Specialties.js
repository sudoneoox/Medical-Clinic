import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const Specialty = sequelize.define(
  "Specialty",
  {
    specialties_code: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    specialty_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "specialties",
    timestamps: false,
  }
);

export default Specialty;
