import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const TimeSlots = sequelize.define(
  "TimeSlots",
  {
    slot_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
      unique: true,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "time_slots",
    timestamps: false,
  },
);

export default TimeSlots;
