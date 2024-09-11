const DataTypes = require('../CompositeTypes/attributes')




const sequelize = require("../../config/database");

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
    medication_info: {
      type: DataTypes.MEDICATION,
      allowNull: false,
    },
    date_issued: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    pharmacy_details: {
      type: DataTypes.JSONB,
    },
  },
  {
    tableName: "prescription",
    timestamps: false,
  }
);

module.exports = Prescription;
