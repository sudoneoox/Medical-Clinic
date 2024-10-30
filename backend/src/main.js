import sequelize from "./config/database.js";
import initModels from "./models/associations.js";

async function waitForDB(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("DB connection successful");
      return true;
    } catch (e) {
      console.log(
        `Database connection attempt ${i + 1}/${retries} failed:`,
        e.message,
      );
      if (i < retries - 1) {
        console.log(`Waiting ${delay / 1000} seconds before retrying...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}

async function initDB() {
  try {
    await waitForDB();

    const models = initModels(sequelize);

    // await sequelize.sync({ alter: false });
    console.log("Models synchronized");

    return models;
  } catch (e) {
    console.error("Error in database initialization:", e);
  }
}

// Start the application
initDB()
  .then((models) => {
    console.log("Database initialization completed successfully");
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
