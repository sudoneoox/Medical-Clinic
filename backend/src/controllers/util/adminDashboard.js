import Admins from "../../models/Tables/Admin.js";
import Users from "../../models/Tables/Users.js";
import Doctor from "../../models/Tables/Doctor.js";
import Patient from "../../models/Tables/Patient.js";
import Appointment from "../../models/Tables/Appointment.js";
import Billing from "../../models/Tables/Billing.js";
import { Op } from "sequelize";
import Demographics from "../../models/Tables/Demographics.js";
import Nurse from "../../models/Tables/Nurse.js";
import Receptionist from "../../models/Tables/Receptionist.js";
import sequelize from "@sequelize/core";

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

const populateUSERMANAGEMENT = async (user, admin, res) => {
  try {
    console.log("hello");
  } catch (error) {
    console.error("ERROR in populateUSERMANAGEMENT For admin", error);
    res.status(500).json({
      message: "Error loading admin usermanagement tools",
      error: error.message,
    });
  }
};

const populateANALYTICS = async (user, admin, analyticData, res) => {
  const { analyticType, office } = analyticData;
  console.log(analyticType, office);
  try {
    let data;
    switch (analyticType) {
      case "DEMOGRAPHICS": {
        const whereClause = office !== "all" ? { office_id: office } : {};

        const demographicStats = await Demographics.findAll({
          include: [
            {
              model: Users,
              where: { user_role: "PATIENT" },
              ...whereClause,
            },
          ],
          attributes: [
            "gender_id",
            [sequelize.fn("COUNT", sequelize.col("gender_id")), "count"],
          ],
          group: ["gender_id"],
        });

        data = demographicStats.map((stat) => ({
          name:
            stat.gender_id === 1
              ? "Male"
              : stat.gender_id === 2
                ? "Female"
                : stat.gender_id === 3
                  ? "Non-binary"
                  : "Other",
          value: parseInt(stat.dataValues.count),
        }));
        break;
      }

      case "STAFF": {
        const whereClause = office !== "all" ? { office_id: office } : {};

        const [doctors, nurses, receptionists] = await Promise.all([
          Doctor.count(whereClause),
          Nurse.count(whereClause),
          Receptionist.count(whereClause),
        ]);

        data = [
          { name: "Doctors", value: doctors },
          { name: "Nurses", value: nurses },
          { name: "Receptionists", value: receptionists },
        ];
        break;
      }

      case "APPOINTMENTS": {
        const whereClause = office !== "all" ? { office_id: office } : {};

        const appointmentStats = await Appointment.findAll({
          where: whereClause,
          attributes: [
            "status",
            [sequelize.fn("COUNT", sequelize.col("status")), "count"],
          ],
          group: ["status"],
        });

        data = appointmentStats.map((stat) => ({
          name: stat.status,
          value: parseInt(stat.dataValues.count),
        }));
        break;
      }

      default:
        throw new Error("Invalid analytics type");
    }

    res.json({ data });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      message: "Error fetching analytics",
      error: error.message,
    });
  }
};

const adminDashboard = {
  populateOVERVIEW,
  populateUSERMANAGEMENT,
  populateANALYTICS,
};
export default adminDashboard;
