import express from "express";
import receptionistDashboard from "../controllers/util/receptionistDashboard.js";

const router = express.Router();

router.post(
  "/appointments",
  receptionistDashboard.populateAPPOINTMENTS,
);

export default router;
