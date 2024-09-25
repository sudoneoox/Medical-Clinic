import { DataTypes } from '../CompositeTypes/attributes';
import { sequelize } from '../../config/database';

const DoctorOffices = sequelize.define(
  "DoctorOffices",
  {
    doctor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    office_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "doctor_offices",
    timestamps: false,
  }
);

module.exports = DoctorOffices;
