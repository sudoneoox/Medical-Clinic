import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Medical Clinic API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
