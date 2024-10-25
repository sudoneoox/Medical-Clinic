import express from "express";
import userControllerFuncs from "../controllers/userController.js";
import dashBoardControllerFuncs from "../controllers/userDashBoardController.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "no token provided" });
    console.log("error in verifyToken token");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Invalid Token" });
  }
};

const router = express.Router();

router.post("/register", userControllerFuncs.registerUser);
router.post("/login", userControllerFuncs.loginUser);

router.post("/portal/overview", dashBoardControllerFuncs.portalRoleSwitcher);

router.post("/validate-session", verifyToken, (req, res) => {
  // if middlewaire verifyToken didnt fail return success
  res.json({ message: "Session valid" });
});

export default router;
