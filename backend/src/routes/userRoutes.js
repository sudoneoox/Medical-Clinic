import express from "express";
import userControllerFuncs from "../controllers/userController.js";
import dashBoardControllerFuncs from "../controllers/userDashBoardController.js";
import jwt from "jsonwebtoken";

// TODO: put this in a .env before pushing to production
const JWT_SECRET =
  "adba8f88a5b4a2898b62366a3763837ca6669d9dd5048bb64af0e7717ded0569";

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
router.post(
  "/dashboard",
  verifyToken,
  dashBoardControllerFuncs.populateDashboard,
);

export default router;
