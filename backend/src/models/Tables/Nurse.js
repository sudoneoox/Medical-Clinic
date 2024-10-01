import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const Nurse = sequelize.define(
  "Nurse",
  {
    nurse_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    nurse_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    nurse_employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    specialization: {
      type: DataTypes.STRING(50),
    },
    years_of_experience: {
      type: DataTypes.TINYINT,
      validate: {
        min: 0,
        max: 90,
      },
    },
  },
  {
    tableName: "nurses",
    timestamps: false,
  }
);

export default Nurse;
