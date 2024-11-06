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
import ReceptionistOffices from "../../models/Tables/ReceptionistOffices.js";
import PatientDoctor from "../../models/Tables/PatientDoctor.js";
import NurseOffices from "../../models/Tables/NurseOffices.js";
import Specialty from "../../models/Tables/Specialties.js";
import DoctorOffices from "../../models/Tables/DoctorOffices.js";
import DoctorSpecialties from "../../models/Tables/DoctorSpecialties.js";
import Office from "../../models/Tables/Office.js";
import sequelize from "@sequelize/core";
import EmployeeNo from "../../models/Tables/ValidEmployeeNo.js";
import logic from "./shared/logic.js";
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

const populateUSERMANAGEMENT = async (user, admin, managementData, res) => {
  console.error("RECEIVED IN populateUSERMANAGEMENT", managementData);
  const { analyticType, subCategory } = managementData;
  try {
    let data;
    switch (analyticType) {
      case "EMPLOYEEMANAGE": {
        switch (subCategory) {
          case "DOCTORMANAGE": {
            const doctors = await Doctor.findAll({
              include: [
                {
                  model: Users,
                  attributes: [
                    "user_email",
                    "user_phone",
                    "account_created_at",
                  ],
                },
                {
                  association: "specialtiesDoctors", // Use the association name
                  include: [
                    {
                      model: Specialty,
                      attributes: ["specialty_name"],
                    },
                  ],
                },
                {
                  association: "officesDoctors", // Use the association name
                  include: [
                    {
                      model: Office,
                      attributes: ["office_name"],
                    },
                  ],
                },
              ],
              attributes: [
                "doctor_id",
                "doctor_employee_id",
                "doctor_fname",
                "doctor_lname",
                "years_of_experience",
              ],
            });
            console.log("received in DOCTORS", doctors[0].specialtiesDoctors);

            data = doctors.map((doc) => ({
              id: doc.doctor_id,
              employeeId: doc.doctor_employee_id,
              name: `${doc.doctor_fname} ${doc.doctor_lname}`,
              email: doc.user.user_email,
              phone: doc.user.user_phone,
              experience: doc.years_of_experience,
              specialties:
                doc.specialtiesDoctors?.map(
                  (spec) => spec.specialty.specialty_name,
                ) || [],
              offices:
                doc.officesDoctors?.map((off) => off.office.office_name) || [],
              joinDate: doc.user.account_created_at,
            }));
            break;
          }

          case "NURSEMANAGE": {
            const nurses = await Nurse.findAll({
              include: [
                {
                  model: Users,
                  attributes: [
                    "user_email",
                    "user_phone",
                    "account_created_at",
                  ],
                },
                {
                  association: "officesNurses", // Use the association name
                  include: [
                    {
                      model: Office,
                      attributes: ["office_name"],
                    },
                  ],
                },
              ],
              attributes: [
                "nurse_id",
                "nurse_employee_id",
                "nurse_fname",
                "nurse_lname",
                "specialization",
                "years_of_experience",
              ],
            });

            data = nurses.map((nurse) => ({
              id: nurse.nurse_id,
              employeeId: nurse.nurse_employee_id,
              name: `${nurse.nurse_fname} ${nurse.nurse_lname}`,
              email: nurse.user.user_email,
              phone: nurse.user.user_phone,
              specialization: nurse.specialization,
              experience: nurse.years_of_experience,
              offices:
                nurse.officesNurses?.map((off) => off.office.office_name) || [],
              joinDate: nurse.user.account_created_at,
            }));
            break;
          }
          case "RECEPTIONISTMANAGE": {
            const receptionists = await Receptionist.findAll({
              include: [
                {
                  model: Users,
                  attributes: [
                    "user_email",
                    "user_phone",
                    "account_created_at",
                  ],
                },
                {
                  association: "officesReceptionists", // Use the association name
                  include: [
                    {
                      model: Office,
                      attributes: ["office_name"],
                    },
                  ],
                },
              ],
              attributes: [
                "receptionist_id",
                "receptionist_employee_id",
                "receptionist_fname",
                "receptionist_lname",
              ],
            });

            data = receptionists.map((receptionist) => ({
              id: receptionist.receptionist_id,
              employeeId: receptionist.receptionist_employee_id,
              name: `${receptionist.receptionist_fname} ${receptionist.receptionist_lname}`,
              email: receptionist.user.user_email,
              phone: receptionist.user.user_phone,
              offices:
                receptionist.officesReceptionists?.map(
                  (off) => off.office.office_name,
                ) || [],
              joinDate: receptionist.user.account_created_at,
            }));
            break;
          }
          default:
            throw new Error("Invalid employee subcategory");
        }
        break;
      }

      case "PATIENTSMANAGE": {
        const patients = await Patient.findAll({
          include: [
            {
              model: Users,
              include: [
                {
                  model: Demographics,
                  attributes: ["dob"],
                },
              ],
              attributes: ["user_email", "user_phone", "account_created_at"],
            },
            {
              association: "doctorsPatients",
              include: [
                {
                  model: Doctor,
                  attributes: ["doctor_fname", "doctor_lname"],
                },
              ],
              where: { is_primary: true },
              required: false,
            },
          ],
          attributes: [
            "patient_id",
            "patient_fname",
            "patient_lname",
            "emergency_contacts",
          ],
        });

        data = patients.map((patient) => ({
          id: patient.patient_id,
          name: `${patient.patient_fname} ${patient.patient_lname}`,
          email: patient.user.user_email,
          phone: patient.user.user_phone,
          dob: patient.user.demographics.dob,
          emergencyContact: patient.emergency_contacts,
          primaryDoctor: patient.doctorsPatients?.[0]?.Doctor
            ? `Dr. ${patient.doctorsPatients[0].Doctor.doctor_fname} ${patient.doctorsPatients[0].Doctor.doctor_lname}`
            : "No Primary Doctor",
          joinDate: patient.user.account_created_at,
        }));
        break;
      }

      case "ADDEMPLOYEE": {
        const employeeData = managementData.employeeData;
        if (employeeData) {
          // Handle the employee registration
          const existingEmployee = await EmployeeNo.findOne({
            where: { employee_no: employeeData.employee_no },
          });

          if (existingEmployee) {
            return res.status(400).json({
              message: "Employee ID already exists",
              error: "DUPLICATE_ID",
            });
          }

          await EmployeeNo.create({
            employee_no: employeeData.employee_no,
            employee_role: employeeData.employee_role,
          });

          return res.json({
            success: true,
            message: "Employee added successfully",
          });
        }

        // If no employeeData, return initial state data
        const existingEmployees = await EmployeeNo.findAll({
          attributes: ["employee_no", "employee_role"],
        });

        return res.json({
          data: {
            existingEmployees: existingEmployees.map((emp) => ({
              id: emp.employee_no,
              role: emp.employee_role,
            })),
          },
        });
      }

      default:
        throw new Error("Invalid management type");
    }

    res.json({ data });
  } catch (error) {
    console.error("ERROR in populateUSERMANAGEMENT For admin", error);
    res.status(500).json({
      message: "Error loading admin usermanagement tools",
      error: error.message,
    });
  }
};
// TODO: switch off the deprecated functions
const populateANALYTICS = async (user, admin, analyticData, res) => {
  const { analyticType, subCategory, office } = analyticData;
  console.log("RECEIVED INSIDE populateANALYTICS");
  console.log(analyticType, subCategory, office);
  try {
    let data;
    switch (analyticType) {
      case "DEMOGRAPHICS": {
        const whereClause = office !== "all" ? { office_id: office } : {};

        switch (subCategory) {
          case "GENDER": {
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

          case "AGE": {
            const ageStats = await Demographics.findAll({
              include: [
                {
                  model: Users,
                  where: { user_role: "PATIENT" },
                  ...whereClause,
                  attributes: [], // Don't include user attributes in the result
                },
              ],
              attributes: [
                [
                  sequelize.literal(`
          CASE 
            WHEN TIMESTAMPDIFF(YEAR, Demographics.dob, CURDATE()) < 18 THEN '0-17'
            WHEN TIMESTAMPDIFF(YEAR, Demographics.dob, CURDATE()) < 30 THEN '18-29'
            WHEN TIMESTAMPDIFF(YEAR, Demographics.dob, CURDATE()) < 50 THEN '30-49'
            WHEN TIMESTAMPDIFF(YEAR, Demographics.dob, CURDATE()) < 70 THEN '50-69'
            ELSE '70+'
          END
        `),
                  "age_group",
                ],
                [
                  sequelize.fn(
                    "COUNT",
                    sequelize.col("Demographics.demographics_id"),
                  ),
                  "count",
                ],
              ],
              group: ["age_group"],
              order: [[sequelize.literal("age_group"), "ASC"]],
            });

            data = ageStats.map((stat) => ({
              name: stat.dataValues.age_group,
              value: parseInt(stat.dataValues.count),
            }));
            break;
          }
          case "ETHNICITY": {
            const ethnicityStats = await Demographics.findAll({
              include: [
                {
                  model: Users,
                  where: { user_role: "PATIENT" },
                  ...whereClause,
                },
              ],
              attributes: [
                "ethnicity_id",
                [sequelize.fn("COUNT", sequelize.col("ethnicity_id")), "count"],
              ],
              group: ["ethnicity_id"],
            });

            data = ethnicityStats.map((stat) => ({
              name:
                stat.ethnicity_id === 1
                  ? "Hispanic or Latino"
                  : stat.ethnicity_id === 2
                    ? "Not Hispanic or Latino"
                    : "Prefer not to say",
              value: parseInt(stat.dataValues.count),
            }));
            break;
          }

          default:
            throw new Error("Invalid demographic subcategory");
        }
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

      case "BILLING": {
        const whereClause = office !== "all" ? { office_id: office } : {};

        switch (subCategory) {
          case "PAYMENT_STATUS": {
            const billingStats = await Billing.findAll({
              where: whereClause,
              attributes: [
                "payment_status",
                [sequelize.fn("COUNT", sequelize.col("billing_id")), "count"],
                [
                  sequelize.fn("SUM", sequelize.col("amount_due")),
                  "total_amount",
                ],
              ],
              group: ["payment_status"],
            });

            data = billingStats.map((stat) => ({
              name: stat.payment_status,
              value: parseInt(stat.dataValues.count),
              amount: parseFloat(stat.dataValues.total_amount),
            }));
            break;
          }

          case "REVENUE": {
            const revenueStats = await Billing.findAll({
              where: {
                ...whereClause,
                payment_status: "PAID",
              },
              attributes: [
                [
                  sequelize.fn(
                    "DATE_FORMAT",
                    sequelize.col("created_at"),
                    "%Y-%m",
                  ),
                  "month",
                ],
                [
                  sequelize.fn("SUM", sequelize.col("amount_paid")),
                  "total_revenue",
                ],
              ],
              group: [
                sequelize.fn(
                  "DATE_FORMAT",
                  sequelize.col("created_at"),
                  "%Y-%m",
                ),
              ],
              order: [
                [
                  sequelize.fn(
                    "DATE_FORMAT",
                    sequelize.col("created_at"),
                    "%Y-%m",
                  ),
                  "DESC",
                ],
              ],
              limit: 12,
            });

            data = revenueStats.map((stat) => ({
              name: stat.dataValues.month,
              value: parseFloat(stat.dataValues.total_revenue),
            }));
            break;
          }
        }
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

const getAnalyticsDetails = async (req, res) => {
  const { analyticType, subCategory, office, filter } = req.body.analyticData;

  try {
    let details;
    switch (analyticType) {
      case "DEMOGRAPHICS": {
        details = await Demographics.findAll({
          include: [
            {
              model: Users,
              where: {
                user_role: "PATIENT",
                ...(office !== "all" && { office_id: office }),
              },
              attributes: ["user_id", "user_email"],
            },
          ],
          where: {
            [subCategory.toLowerCase() + "_id"]: logic.getDemographicId(
              subCategory,
              filter,
            ),
          },
          limit: 100,
        });
        break;
      }

      case "BILLING": {
        details = await Billing.findAll({
          where: {
            ...(office !== "all" && { office_id: office }),
            ...(subCategory === "PAYMENT_STATUS" && { payment_status: filter }),
          },
          include: [
            {
              model: Patient,
              attributes: ["patient_fname", "patient_lname"],
            },
          ],
          limit: 100,
        });
        break;
      }
    }

    res.json({ details });
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ message: "Error fetching details" });
  }
};

const adminDashboard = {
  populateOVERVIEW,
  populateUSERMANAGEMENT,
  populateANALYTICS,
  getAnalyticsDetails,
};
export default adminDashboard;
