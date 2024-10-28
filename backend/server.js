import express from "express";
import cors from "cors";
import UserLogicRouter from "./src/routes/userRoutes.js";
import HomePageRouter from "./src/routes/homepageRouter.js";
import allowedOrigins from "./src/config/allowedOrigins.js";
import "./src/main.js"; // to initialize the associations it runs on its own

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();

// enable cors ie so our frontend server (port 3000) can communicate with
// our backend server (port 5000)
app.use(cors());

// parse json bodies
app.use(express.json());

// use user routes
app.use("/api/users", UserLogicRouter);

// use homepage routes
app.use("/api/homepage", HomePageRouter);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Medical Clinic API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
