const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    passwd: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.JSON,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    last_login: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    role: {
      type: DataTypes.ENUM("admin", "doctor", "patient"),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;
