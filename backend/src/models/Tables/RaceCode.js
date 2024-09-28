import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const RaceCode = sequelize.define(
    "RaceCode",
    {
      race_code: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
      },
      race_text: {
        type: DataTypes.STRING(20),
      },
    },
    {
      tableName: "race_code",
      timestamps: false,
    }
  );

export default RaceCode;