const { DataTypes } = require("sequelize");
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
      type: DataTypes.JSON,
      unique: true,
      get() {
        const rawValue = this.getDataValue("insurance");
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue("insurance", JSON.stringify(value));
      },
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
