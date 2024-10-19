import express from "express";
import ServicesFuncs from '../controllers/ServicesController.js'

const router = express.Router();

router.post('/specialities', ServicesFuncs.fetchSpecialties);

export default router;
