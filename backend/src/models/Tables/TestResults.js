import DataTypes from "../CompositeTypes/customTypes.js";
import sequelize from "../../config/database.js";

const TestResults = sequelize.define("TestResults", {
  test_results_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  test_type: {
    type: DataTypes.ENUM("BLOOD", "XRAY", "URINE"),
  },
  test_name: {
    type: DataTypes.STRING,
  },
  test_conducted_date: {
    type: DataTypes.DATE,
  },
  test_result: {
    type: DataTypes.JSON,
  },
  test_units: {
    type: DataTypes.STRING,
  },
  test_interpretation: {
    type: DataTypes.ENUM("BELOW", "NORMAL", "ABOVE"),
  },
  test_status: {
    type: DataTypes.ENUM("PENDING", "COMPLETED"),
  },
  test_performed_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  medical_record_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
  {
    tableName: 'test_results',
    timestamps: false,
  }
);

export default TestResults;
