const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SpecialistApproval = sequelize.define(
  "SpecialistApproval",
  {
    approval_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requesting_doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    specialist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requested_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    approved_at: {
      type: DataTypes.DATE,
    },
    specialist_request_status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      allowNull: false,
    },
  },
  {
    tableName: "specialist_approvals",
    timestamps: false,
  }
);

module.exports = SpecialistApproval;
