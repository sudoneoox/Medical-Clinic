import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const AuditLog = sequelize.define(
  "AuditLog",
  {
    log_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    table_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    audit_action: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    changed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    changed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    old_values: {
      type: DataTypes.JSON,
    },
    new_values: {
      type: DataTypes.JSON,
    },
  },
  {
    tableName: "AUDIT_LOG",
    timestamps: false,
  }
);

export default AuditLog;
