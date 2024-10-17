import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

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
  },
  {
    tableName: "specialties_code",
    timestamps: false,
  }
);

export default Specialty;
