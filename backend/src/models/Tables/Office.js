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
      unique: true,
      get() {
        const rawValue = this.getDataValue("address");
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue("address", JSON.stringify(value));
      },
    },
    phone: {
      type: DataTypes.JSON,
      unique: true,
      get() {
        const rawValue = this.getDataValue("phone");
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue("phone", JSON.stringify(value));
      },
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
