import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";
const Admins = sequelize.define(
  "Admins",
  {
    admin_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    admin_employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    admin_fname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    admin_lname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    can_manage_users: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
    },
    can_manage_billing: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
    },
    can_manage_appointments: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
    },
    can_review_reports: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
    },
    created_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    last_access: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "admins",
    timestamps: false,
  },
);

export default Admins;
