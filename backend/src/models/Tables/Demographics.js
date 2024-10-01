import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const Demographics = sequelize.define(
  "Demographics",
  {
    demographics_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
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
      type: DataTypes.TIMESTAMP,
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
    updated_at: {
      type: DataTypes.TIMESTAMP,
    },
  },
  {
    tableName: "demographics",
    timestamps: false,
  }
);

export default Demographics;
