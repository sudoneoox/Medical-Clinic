import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const Allergies = sequelize.define(
  "detailed_allergies",
  {
    allergy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    medical_record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    allergy_type: {
      type: DataTypes.ENUM("FOOD", "MEDICATION", "ENVIRONMENTAL"),
      allowNull: false,
    },
    allergen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reaction: {
      type: DataTypes.TEXT,
    },
    severity: {
      type: DataTypes.ENUM("MILD", "MODERATE", "SEVERE"),
      allowNull: false,
    },
    onset_date: {
      type: DataTypes.DATE,
    },
  },

  {
    tableName: "detailed_allergies",
    timestamps: false,
  }
);

export default MedicalRecord;
