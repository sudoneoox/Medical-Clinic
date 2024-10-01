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
    shift_start: {
      type: DataTypes.TIME,
    },
    shift_end: {
      type: DataTypes.TIME,
    },
  },
  {
    tableName: "receptionist_offices",
    timestamps: false,
  }
);

export default ReceptionistOffices;
