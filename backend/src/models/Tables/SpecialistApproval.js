import  DataTypes from '../CompositeTypes/customTypes.js';
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
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      approved_at: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.SPECIALIST_REQUEST_STATUS,
        allowNull: false,
      },
    },
    {
      tableName: "specialist_approvals",
      timestamps: false,
    }
  );

export default SpecialistApproval;