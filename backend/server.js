import express from "express";
import cors from "cors";
import UserLogicRouter from "./src/routes/userRoutes.js";
import HomePageRouter from "./src/routes/homepageRouter.js";
import "./src/main.js";

const app = express();

console.log("Starting server initialization...");
console.log("Environment variables:");
console.log("PORT:", process.env.PORT);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

try {
  // enable cors
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
    }),
  );

  app.use(express.json());

  console.log("Initializing database connection...");
  await import("./src/main.js");
  console.log("Database initialization complete");

  app.use("/api/users", UserLogicRouter);
  app.use("/api/homepage", HomePageRouter);

  const PORT = process.env.PORT || 5000;

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy" });
  });

  app.get("/", (req, res) => {
    res.send("Medical Clinic API is running");
  });

  app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
