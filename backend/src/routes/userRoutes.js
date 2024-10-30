import express from "express";
import userControllerFuncs from "../controllers/userController.js";
import dashBoardControllerFuncs from "../controllers/userDashBoardController.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET =
  "adba8f88a5b4a2898b62366a3763837ca6669d9dd5048bb64af0e7717ded0569";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "no token provided" });
    console.error("error in verifyToken token");
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
router.post("/portal/analytics", dashBoardControllerFuncs.portalRoleSwitcher);
router.post("/portal/management", dashBoardControllerFuncs.portalRoleSwitcher);
// TODO: handle delete
// router.post("/portal/management/delete", null);
router.post("/portal/users", dashBoardControllerFuncs.portalRoleSwitcher);
router.post("/portal/overview", dashBoardControllerFuncs.portalRoleSwitcher);
router.post("/portal/calendar", dashBoardControllerFuncs.portalRoleSwitcher);
router.post(
  "/portal/medical-records",
  dashBoardControllerFuncs.portalRoleSwitcher,
);
router.post(
  "/portal/my-appointments",
  dashBoardControllerFuncs.portalRoleSwitcher,
);
router.post("/portal/patients", dashBoardControllerFuncs.portalRoleSwitcher); // for doc

router.post("/validate-session", verifyToken, (req, res) => {
  // if middlewaire verifyToken didnt fail return success
  res.json({ message: "Session valid" });
});

export default router;
