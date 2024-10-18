import { Sequelize } from "@sequelize/core";
import { MySqlDialect } from "@sequelize/mysql";
import "dotenv/config";

const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: "medical_clinic",
  user: "root",
  password: "admin321",
  host: "localhost",
  logging: false, // set to console.log to see the raw SQL queries
  port: 3306,

});

export default sequelize;
