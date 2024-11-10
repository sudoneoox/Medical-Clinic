import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const DoctorAvailibility = sequelize.define(
  "DoctorAvailibility",
  {
    availability_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    office_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    day_of_week: {
      type: DataTypes.ENUM(
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ),
      allowNull: false,
      unique: true,
    },
    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    is_available: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    recurrence_type: {
      type: DataTypes.ENUM("WEEKLY", "ONE_TIME"),
      defaultValue: "WEEKLY",
    },
    specific_date: {
      type: DataTypes.DATE,
      allowNull: true,
      unique: true,
    },
    created_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "doctor_availability",
    timestamps: false,
  },
);

export default DoctorAvailibility;
