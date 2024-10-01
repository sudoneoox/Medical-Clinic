// File: main.js
import sequelize from "./config/database.js";
import initModels from "./models/associations.js";

async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("DB connection successful");

    const models = initModels(sequelize);

    // Synchronize models with the database
    // Using { force: true } will drop tables if they exist and recreate them
    // WARNING: Only use force: true in development or testing, never in production
    await sequelize.sync({ alter:false }); // Alternatively, use { force: true } for testing
    console.log("Models synchronized");

    return models;
  } catch (e) {
    console.log("Error encountered in /backend/src/main.js: ", e);
    throw e;
  }
}

initDB().then((models) => {
  // Use models here or export them if needed
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});