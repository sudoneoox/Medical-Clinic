import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const AppointmentReminders = sequelize.define(
  "AppointmentReminders",
  {
    reminder_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reminder_status: {
      type: DataTypes.ENUM("Pending", "Sent", "Failed"),
      allowNull: false,
    },
    scheduled_time: {
      type: DataTypes.TIMESTAMP,
      allowNull: false,
    },
    sent_time: {
      type: DataTypes.TIMESTAMP,
      allowNull: false,
    },
  },
  {
    tableName: "appointment_reminders",
    timestamps: false,
  }
);

export default AppointmentReminders;