import { Sequelize } from "@sequelize/core";
import { MySqlDialect } from "@sequelize/mysql";
import dotenv from 'dotenv';

dotenv.config()
console.log(process.env)

// TODO:
// preferrably use the dotenv to set up the database connection but 
// im having issues with it reading my root directory .env file
// const sequelize = new Sequelize({
//   dialect: MySqlDialect,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: 3306,
//   logging: console.log, // Temporarily enable logging
// });
//
const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database:  "medical_clinic", 
  user: "admin",
  password: "abc",
  host: "localhost",
  port: 3306,
  logging: console.log, // Temporarily enable logging
});





export default sequelize;
