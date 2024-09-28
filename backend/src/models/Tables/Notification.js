import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const Notification = sequelize.define(
    "Notification",
    {
      notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type_notif: {
        type: DataTypes.NOTIFICATION_TYPE,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      read_at: {
        type: DataTypes.DATE,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      related_entity_type: {
        type: DataTypes.STRING(30),
      },
      related_entity_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "notifications",
      timestamps: false,
    }
  );



export default Notification;