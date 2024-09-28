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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
      created_by: {
        type: DataTypes.INTEGER,
      },
      updated_by: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "medical_records",
      timestamps: false,
    }
  );



export default MedicalRecord;