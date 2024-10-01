import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const GenderCode = sequelize.define(
    "GenderCode",
    {
      gender_code: {
        type: DataTypes.TINYINT,
        primaryKey: true,
      },
      gender_text: {
        type: DataTypes.STRING(20),
      },
    },
    {
      tableName: "gender_code",
      timestamps: false,
    }
  );


export default GenderCode;