import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const SpecialistApproval = sequelize.define(
  "SpecialistApproval",
  {
    approval_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    requested_at: {
      type: DataTypes.TIMESTAMP,
    },
    approved_at: {
      type: DataTypes.TIMESTAMP,
    },
    specialist_status: {
      type: DataTypes.SPECIALIST_REQUEST_STATUS,
      allowNull: false,
      defaultValue: "PENDING",
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reffered_doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    specialist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "specialist_approvals",
    timestamps: false,
  }
);

export default SpecialistApproval;
