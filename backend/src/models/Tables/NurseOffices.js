import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const NurseOffices = sequelize.define(
    "NurseOffices",
    {
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