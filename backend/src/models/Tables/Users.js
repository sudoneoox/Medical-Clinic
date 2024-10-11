import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    user_password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    user_phone: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    account_created_at: {
      type: DataTypes.TIMESTAMP,
    },
    account_last_login: {
      type: DataTypes.TIMESTAMP,
    },
    user_role: {
      type: DataTypes.ENUM("Admin", "Patient", "Doctor", "Receptionist", "Nurse"),
      allowNull: false,
    },
    portal_last_login: {
      type: DataTypes.TIMESTAMP,
    }
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

export default User;