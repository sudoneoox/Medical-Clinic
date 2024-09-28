import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const AppointmentCancellations = sequelize.define(
  "AppointmentCancellations",
  {
    cancellation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    canceled_reason: {
      type: DataTypes.TEXT,
    },
    canceled_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "appointment_cancellations",
    timestamps: false,
  }
);

export default AppointmentCancellations;
