const DataTypes = require('../CompositeTypes/attributes')




const sequelize = require("../../config/database");


const AuditLog = sequelize.define(
  "AuditLog",
  {
    log_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    table_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    changed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    changed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    old_values: {
      type: DataTypes.JSONB,
    },
    new_values: {
      type: DataTypes.JSONB,
    },
  },
  {
    tableName: "AUDIT_LOG",
    timestamps: false,
  }
);

module.exports = AuditLog;
