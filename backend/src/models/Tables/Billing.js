import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

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
      type: DataTypes.DECIMAL(7, 2),
      allowNull: false,
    },
    amount_paid: {
      type: DataTypes.DECIMAL(7, 2),
      allowNull: false,
      defaultValue: 0,
    },
    payment_status: {
      type: DataTypes.ENUM(
        "PAID",
        "NOT PAID",
        "IN PROGRESS",
        "CANCELLED",
        "REFUNDED",
      ),
      allowNull: false,
    },
    billing_due: {
      type: "TIMESTAMP",
      allowNull: false,
    },
    created_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    handled_by: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "billing",
    timestamps: false,
  },
);

export default Billing;
