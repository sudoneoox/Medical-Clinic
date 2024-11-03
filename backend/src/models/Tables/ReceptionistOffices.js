import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const ReceptionistOffices = sequelize.define(
  "ReceptionistOffices",
  {
    receptionist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    office_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
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
      primaryKey: true,
    },
    shift_start: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    shift_end: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    is_primary_office: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    effective_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_DATE"),
    },
    effective_end_date: {
      type: DataTypes.DATE,
    },
    schedule_type: {
      type: DataTypes.ENUM("REGULAR", "TEMPORARY", "ON_CALL"),
      defaultValue: "REGULAR",
    },
  },
  {
    tableName: "receptionist_offices",
    timestamps: false,
  },
);

export default ReceptionistOffices;
