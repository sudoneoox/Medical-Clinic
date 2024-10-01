import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

const Insurance = sequelize.define(
  "Insurance",
  {
    insurance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    insurance_info: {
      type: DataTypes.JSON,
    },
    is_active: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "insurances",
    timestamps: false,
  }
);

export default Insurance;