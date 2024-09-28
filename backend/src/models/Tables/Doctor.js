import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  // ! Doctors
  const Doctor = sequelize.define(
    "Doctor",
    {
      doctor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      doctor_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      license_number: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      years_of_experience: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
          max: 90,
        },
      },
    },
    {
      tableName: "doctor",
      timestamps: false,
    }
  );


export default Doctor;