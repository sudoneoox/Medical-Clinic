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
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    office_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    appointment_datetime: {
      type: DataTypes.TIMESTAMP,
      allowNull: false,
    },
    duration: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    booked_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    attending_nurse: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING(100),
    },
    status: {
      type: DataTypes.ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO SHOW'),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.TIMESTAMP,
    },
    updated_at: {
      type: DataTypes.TIMESTAMP,
    },
  },
  {
    tableName: "appointments",
    timestamps: false,
  }
);

export default Appointment;
