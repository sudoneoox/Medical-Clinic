const DataTypes = require('../CompositeTypes/attributes')

const sequelize = require("../../config/database");

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
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // Storing duration in minutes maybe need to change in sql? migrations
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    appointment_status: {
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
  },
  {
    tableName: "appointments",
    timestamps: false,
  }
);

module.exports = Appointment;
