import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const Receptionist = sequelize.define(
  "Receptionist",
  {
    receptionist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    receptionist_employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receptionist_fname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    receptionist_lname: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "receptionists",
    timestamps: false,
  }
);

export default Receptionist;
