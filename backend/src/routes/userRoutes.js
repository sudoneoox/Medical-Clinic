import express from "express";
import userControllerFuncs from "../controllers/userController.js";


const router = express.Router();

router.post("/register", userControllerFuncs.registerUser);
router.post('/login', userControllerFuncs.loginUser);;

export default router;
