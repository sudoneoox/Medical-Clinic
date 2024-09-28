import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const Prescription = sequelize.define(
    "Prescription",
    {
      prescription_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      medication_info: {
        type: DataTypes.MEDICATION,
        allowNull: false,
      },
      date_issued: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      pharmacy_details: {
        type: DataTypes.JSON,
      },
    },
    {
      tableName: "prescription",
      timestamps: false,
    }
  );


export default Prescription;