import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const Insurance = sequelize.define(
    "Insurance",
    {
      insurance_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      insurance_info: {
        type: DataTypes.INSURANCE,
        allowNull: false,
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

export default Insurance;