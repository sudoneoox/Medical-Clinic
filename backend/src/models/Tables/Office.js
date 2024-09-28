import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const Office = sequelize.define(
    "Office",
    {
      office_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      office_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      office_address: {
        type: DataTypes.MEDICATION,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
      },
      email: {
        type: DataTypes.TEXT,
        validate: {
          isEmail: true,
        },
      },
      services: {
        type: DataTypes.JSON, // ! Array of STRING(50)
      },
    },
    {
      tableName: "office",
      timestamps: false,
    }
  );

export default Office