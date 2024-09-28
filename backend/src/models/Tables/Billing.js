import  DataTypes from '../CompositeTypes/customTypes.js';
import sequelize from "../../config/database.js";

  const Billing = sequelize.define(
    "Billing",
    {
      billing_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      amount_due: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      amount_paid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      payment_status: {
        type: DataTypes.BILLING_STATUS,
        allowNull: false,
      },
      billing_due: {
        type: DataTypes.DATE,
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
      handled_by: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "billing",
      timestamps: false,
    }
  );

export default Billing;
