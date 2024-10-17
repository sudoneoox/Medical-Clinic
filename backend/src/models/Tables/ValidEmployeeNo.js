import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

const EmployeeNo = sequelize.define(
  "EmployeeNo",
  {
    employee_no: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey: true,
      unique: true,
    },
    employee_role: {
      type: DataTypes.ENUM("DOCTOR", "RECEPTIONIST", "NURSE", "ADMIN"),
      allowNull: false,
    },
  },
  {
    tableName: "valid_employees",
    timestamps: false,
  }
);

export default EmployeeNo;
