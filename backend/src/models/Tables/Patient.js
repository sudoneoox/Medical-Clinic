const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Patient = sequelize.define(
  "Patient",
  {
    patient_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    patient_name: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(30),
    },
    ethnicities: {
      type: DataTypes.ARRAY(DataTypes.STRING(50)),
    },
    address: {
      type: DataTypes.JSON,
    },
    emergency_contacts: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
    primary_doctor_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "patient",
    timestamps: false,
  }
);

module.exports = Patient;
