import express from "express";
import Specialities from "../controllers/ServicesController.js";

const router = express.Router();

router.post('/specialities', Specialities.fetchSpecialties);

export default router;