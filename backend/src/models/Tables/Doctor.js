const { DataTypes } = require("sequelize");
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
      unique: true,
    },
    doctor_name: {
      type: DataTypes.JSON,
      unique: true,
      get() {
        const rawValue = this.getDataValue("doctor_name");
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue("doctor_name", JSON.stringify(value));
      },
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
