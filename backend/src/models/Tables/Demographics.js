import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const Demographics = sequelize.define(
    "Demographics",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      ethnicity: {
        type: DataTypes.SMALLINT,
      },
      race: {
        type: DataTypes.SMALLINT,
      },
      gender: {
        type: DataTypes.SMALLINT,
      },
      dob: {
        type: DataTypes.DATE,
      },
      created_by: {
        type: DataTypes.INTEGER,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_by: {
        type: DataTypes.INTEGER,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "demographics",
      timestamps: false,
    }
  );

export default Demographics;