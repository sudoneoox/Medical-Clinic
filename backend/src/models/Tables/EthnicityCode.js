import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const EthnicityCode = sequelize.define(
    "EthnicityCode",
    {
      ethnicity_code: {
        type: DataTypes.TINYINT,
        primaryKey: true,
      },
      ethnicity_text: {
        type: DataTypes.STRING(20),
      },
    },
    {
      tableName: "ethnicity_code",
      timestamps: false,
    }
  );

export default EthnicityCode;