import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const GenderCode = sequelize.define(
    "GenderCode",
    {
      gender_code: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        allowNull: false,
      },
      gender_text: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "gender_code",
      timestamps: false,
    }
  );


export default GenderCode;
