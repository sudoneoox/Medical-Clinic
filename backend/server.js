import express from "express";
import cors from "cors";
import router from "./src/routes/userRoutes.js"
const app = express();

// enable cors ie so our frontend server (port 3000) can communicate with
// our backend server (port 5000)
app.use(cors());

// parse json bodies
app.use(express.json());

// use user routes
app.use('/api/users', router);



const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Medical Clinic API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
