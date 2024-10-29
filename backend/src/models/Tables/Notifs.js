import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const Notifs = sequelize.define(
  "Notifs",
  {
    notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNUll: false,
    },
    notification_type: {
      type: DataTypes.ENUM(
        "APPOINTMENT_REMINDER",
        "TEST_RESULTS",
        "PRESCRIPTION_READY",
        "BILLING_REMINDER",
        "MESSAGE",
        "EMERGENCY_ALERT",
        "SCHEDULE_CHANGE",
        "INSURANCE_UPDATE",
        "DOCUMENT_READY",
        "GENERAL",
      ),
    },
    notification_title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    notification_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "URGENT"),
      defaultValue: "MEDIUM",
    },
    is_read: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    read_at: {
      type: "TIMESTAMP",
      allowNull: true,
    },
    scheduled_for: {
      type: "TIMESTAMP",
      allowNull: true,
    },
    expires_at: {
      type: "TIMESTAMP",
      allowNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    metadata: {
      type: DataTypes.JSON,
    },
  },
  {
    tableName: "notifications",
    timestamps: false,
  },
);

export default Notifs;
