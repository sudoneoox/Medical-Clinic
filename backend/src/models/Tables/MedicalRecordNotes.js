import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const MedicalRecordNotes = sequelize.define(
  "MedicalRecordNotes",
  {
    note_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    created_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    subject: {
      type: DataTypes.STRING(100),
    },
    description: {
      type: DataTypes.TEXT,
    },
    is_deleted: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    deleted_at: {
      type: "TIMESTAMP",
      allowNull: true,
    },
    medical_record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "medical_record_notes",
    timestamps: false,
  },
);

export default MedicalRecordNotes;
