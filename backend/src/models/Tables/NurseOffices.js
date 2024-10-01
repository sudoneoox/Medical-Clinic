import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";
import { INET, INTEGER } from "sequelize";

const NurseOffices = sequelize.define(
  "NurseOffices",
  {
    nurse_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    office_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    shift_start: {
      type: DataTypes.TIME,
    },
    shift_end: {
      type: DataTypes.TIME,
    },
  },
  {
    tableName: "nurse_offices",
    timestamps: false,
  }
);

export default NurseOffices;
