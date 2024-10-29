import Admins from "../../models/Tables/Admin.js";
import Users from "../../models/Tables/Users.js";
import Doctor from "../../models/Tables/Doctor.js";
import Patient from "../../models/Tables/Patient.js";
import Appointment from "../../models/Tables/Appointment.js";
import Billing from "../../models/Tables/Billing.js";
import { Op } from "sequelize";

const populateOVERVIEW = async (user, admin, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get system statistics
    const [totalUsers, activeDoctor, activePatients] = await Promise.all([
      Users.count(),
      Doctor.count(),
      Patient.count(),
    ]);

    // Get daily statistics
    const [newAppointments, completedVisits, pendingBills] = await Promise.all([
      Appointment.count({
        where: {
          created_at: {
            [Op.between]: [today, tomorrow],
          },
        },
      }),
      Appointment.count({
        where: {
          appointment_datetime: {
            [Op.between]: [today, tomorrow],
          },
          status: "COMPLETED",
        },
      }),
      Billing.count({
        where: {
          payment_status: "NOT PAID",
        },
      }),
    ]);

    // TODO:
    // sample alerst if we have time implement this later added feature if not just simply delete
    const systemAlerts = [
      {
        message: "5 appointments pending specialist approval",
        priority: "MEDIUM",
      },
      {
        message: "System backup completed successfully",
        priority: "LOW",
      },
      {
        message: "3 billing records require immediate attention",
        priority: "HIGH",
      },
    ].filter((_, index) => index < 3); // Only show top 3 alerts

    return res.json({
      adminInfo: {
        name: `${admin.admin_fname} ${admin.admin_lname}`,
        email: user.user_email,
        admin_level: admin.admin_level,
      },
      systemStats: {
        totalUsers,
        activeDoctor,
        activePatients,
      },
      dailyStats: {
        newAppointments,
        completedVisits,
        pendingBills,
      },
      systemAlerts,
    });
  } catch (error) {
    console.error("Error in populateOVERVIEWForAdmin:", error);
    res.status(500).json({
      message: "Error loading admin dashboard",
      error: error.message,
    });
  }
};

const adminDashboard = { populateOVERVIEW };
export default adminDashboard;
