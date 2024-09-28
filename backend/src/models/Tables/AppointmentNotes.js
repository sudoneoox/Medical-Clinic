import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const AppointmentNotes = sequelize.define(
    "AppointmentNotes",
    {
      note_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      note_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      created_by_nurse: {
        type: DataTypes.INTEGER,
      },
      created_by_receptionist: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "appointment_notes",
      timestamps: false,
    }
  );

export default AppointmentNotes;