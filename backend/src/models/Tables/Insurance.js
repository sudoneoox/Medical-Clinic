const DataTypes = require('../CompositeTypes/attributes')


const sequelize = require("../../config/database");

const Insurance = sequelize.define(
  "Insurance",
  {
    insurance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    insurance_info: {
      type: DataTypes.INSURANCE,
      unique: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "insurances",
    timestamps: false,
  }
);

module.exports = Insurance;
