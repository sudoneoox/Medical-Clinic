import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const RaceCode = sequelize.define(
    "RaceCode",
    {
      race_code: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        allowNull: false,
      },
      race_text: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "race_code",
      timestamps: false,
    }
  );

export default RaceCode;
