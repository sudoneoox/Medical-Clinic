import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const Specialty = sequelize.define(
    "Specialty",
    {
      specialty_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      specialty_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: "specialties",
      timestamps: false,
    }
  );

export default Specialty;