const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Office = sequelize.define(
  "Office",
  {
    office_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    address: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    phone: {
      type: DataTypes.JSON,
    },
    email: {
      type: DataTypes.TEXT,
    },
    services: {
      type: DataTypes.ARRAY(DataTypes.STRING(50)),
    },
  },
  {
    tableName: "office",
    timestamps: false,
  }
);

module.exports = Office;
