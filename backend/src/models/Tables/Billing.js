const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Billing = sequelize.define(
  "Billing",
  {
    billing_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount_due: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    amount_paid: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    },
    payment_status: {
      type: DataTypes.ENUM(
        "PAID",
        "NOT PAID",
        "IN PROGRESS",
        "CANCELLED",
        "REFUNDED"
      ),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "billing",
    timestamps: false,
  }
);

module.exports = Billing;
