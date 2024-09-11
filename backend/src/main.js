const sequelize = require("./config/database");
const initAssociations = require("./models/associations");

async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("DB connection successful");
    initAssociations();

    // alter true is not recommended for production set to false after sent to
    // hosting service or finished testing
    await sequelize.sync({ alter: false });
    console.log("models synchronized");
  } catch (e) {
    console.log("Error encountered in /backend/src/main.js: ", e);
  }
}

initDB();
