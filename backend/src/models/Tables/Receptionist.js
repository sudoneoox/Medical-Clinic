import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const Receptionist = sequelize.define(
    "Receptionist",
    {
      receptionist_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receptionist_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      office_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shift_start: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      shift_end: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      tableName: "receptionist",
      timestamps: false,
    }
  );


export default Receptionist;