import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const Prescription = sequelize.define(
  "Prescription",
  {
    prescription_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    medication_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    dosage: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    frequency: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    date_issued: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    pharmacy_details: {
      type: DataTypes.JSON,
    },
  },
  {
    tableName: "prescription",
    timestamps: false,
  },
);

export default Prescription;
