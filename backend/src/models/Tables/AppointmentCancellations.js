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
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    canceled_reason: {
      type: DataTypes.TEXT,
    },
    canceled_at: {
      type: DataTypes.TIMESTAMP,
    },
  },
  {
    tableName: "appointment_cancellations",
    timestamps: false,
  }
);

export default AppointmentCancellations;
