import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const Nurse = sequelize.define(
    "Nurse",
    {
      nurse_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      nurse_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      license_number: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      specialization: {
        type: DataTypes.STRING(50),
      },
      years_of_experience: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
          max: 60,
        },
      },
    },
    {
      tableName: "nurse",
      timestamps: false,
    }
  );


export default Nurse;
