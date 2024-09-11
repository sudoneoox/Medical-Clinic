const DataTypes = require('../CompositeTypes/attributes')




const sequelize = require("../../config/database");

const Doctor = sequelize.define(
  "Doctor",
  {
    doctor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_name: {
      type: DataTypes.NAME,
      unique: false,

    },
    license_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    specialties: {
      type: DataTypes.ARRAY(DataTypes.STRING(50)),
    },
    years_of_experience: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "doctor",
    timestamps: false,
  }
);

module.exports = Doctor;
