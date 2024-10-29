import Admins from "../../models/Tables/Admin.js";
const populateOVERVIEW = async (user, admin, res) => {
  try {
    return res.json({
      message: "SUCCESS",
    });
  } catch (error) {
    console.error("Error in populateOVERVIEWForAdmin:", error);
    res
      .status(500)
      .json({ message: "Error loading admin dashboard", error: error.message });
  }
};

const adminDashboard = { populateOVERVIEW };
export default adminDashboard;
