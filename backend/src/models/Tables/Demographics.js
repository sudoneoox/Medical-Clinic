import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const Demographics = sequelize.define(
  "Demographics",
  {
    demographics_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    ethnicity_id: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    race_id: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    gender_id: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATE,
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
    updated_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "demographics",
    timestamps: false,
  },
);

export default Demographics;
