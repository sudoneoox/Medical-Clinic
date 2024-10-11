import  DataTypes from '../CompositeTypes/customTypes.js';
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
    created_by: {
      type: DataTypes.INTEGER,
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.TIMESTAMP,
    },
    updated_at: {
      type: DataTypes.TIMESTAMP,
    },
    diagnosis: {
      type: DataTypes.STRING(100),
    },
    notes: {
      type: DataTypes.TEXT,
    },
    test_results: {
      type: DataTypes.JSON,
    },
    deleted_at : {
      type: DataTypes.TIMESTAMP,
      defaultValue: null,
    },
    is_deleted: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    }
  },
  {
    tableName: "medical_records",
    timestamps: false,
  }
);


export default MedicalRecord;