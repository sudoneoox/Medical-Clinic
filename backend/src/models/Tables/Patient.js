import { DataTypes } from '../CompositeTypes/attributes';
import { sequelize } from '../../config/database';

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
    },
    patient_name: {
      type: DataTypes.NAME,
      unique: false,

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
      type: DataTypes.ADDRESS,
      unique: false,

    },
    emergency_contacts: {
      type: DataTypes.ARRAY(DataTypes.EMERGENCY_CONTACT),
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
