import { DataTypes } from '../CompositeTypes/attributes';
import { sequelize } from '../../config/database';


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
      validate: {
        isEmail: true,
      },
    },
    // maybe have to make my our own function have to test but this is how people did it online?
    phone_num: {
      type:DataTypes.PHONE_NUM,
      unique: false,

    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    last_login: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    user_role: {
      type: DataTypes.USER_ROLE,
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
