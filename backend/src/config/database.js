import { Sequelize } from "@sequelize/core";
import { MySqlDialect } from "@sequelize/mysql";
import "dotenv/config";

const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: MySqlDialect,
  logging: false, // set to console.log to see the raw SQL queries
  port: 3306,
});


export default sequelize;
