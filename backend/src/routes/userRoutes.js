import express from "express";
import userControllerFuncs from "../controllers/userController.js";
import dashBoardControllerFuncs from '../controllers/userDashBoardController.js'

const router = express.Router();

router.post("/register", userControllerFuncs.registerUser);
router.post('/login', userControllerFuncs.loginUser);

router.post('/portal', dashBoardControllerFuncs.populateDashboard);


export default router;
