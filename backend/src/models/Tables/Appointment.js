import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const Appointment = sequelize.define(
  "Appointment",
  {
    appointment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointment_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // ! Store duration in minutes
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.APPOINTMENT_STATUS,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    booked_by: {
      type: DataTypes.INTEGER,
    },
    attending_nurse: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "appointments",
    timestamps: false,
  }
);

export default Appointment;
