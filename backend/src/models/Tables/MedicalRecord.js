import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const MedicalRecord = sequelize.define(
  "MedicalRecord",
  {
    record_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    appointment_id: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    diagnosis: {
      type: DataTypes.STRING(100),
    },
    deleted_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      defaultValue: null,
    },
    is_deleted: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    prescription_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "medical_records",
    timestamps: false,
  },
);

export default MedicalRecord;
