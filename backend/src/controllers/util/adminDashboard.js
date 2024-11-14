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
import PatientDoctor from "../../models/Tables/PatientDoctor.js";
import Specialty from "../../models/Tables/Specialties.js";
import Office from "../../models/Tables/Office.js";
import sequelize from "../../config/database.js";
import EmployeeNo from "../../models/Tables/ValidEmployeeNo.js";
import logic from "./shared/logic.js";
import { QueryTypes } from "@sequelize/core";
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
              joinDate: new Date(
                doc.user.account_created_at,
              ).toLocaleDateString("en-US"),
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
              joinDate: new Date(
                nurse.user.account_created_at,
              ).toLocaleDateString("en-US"),
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
              joinDate: new Date(
                receptionist.user.account_created_at,
              ).toLocaleDateString("en-US"),
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
              model: Doctor,
              through: {
                model: PatientDoctor,
                where: { is_primary: 1 },
              },
              attributes: ["doctor_fname", "doctor_lname"],
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
        console.log(patients[0].doctors[0].doctor_fname);

        data = patients.map((patient) => {
          const primaryDoctor = patient.doctors?.find(
            (doc) => doc.PatientDoctor.is_primary === 1,
          );
          return {
            id: patient.patient_id,
            name: `${patient.patient_fname} ${patient.patient_lname}`,
            email: patient.user.user_email,
            phone: patient.user.user_phone,
            dob: new Date(patient.user.demographics.dob).toLocaleDateString(
              "en-US",
            ),
            emergencyContact: patient.emergency_contacts,
            primaryDoctor: primaryDoctor
              ? `Dr. ${primaryDoctor.doctor_fname} ${primaryDoctor.doctor_lname}`
              : "No Primary Doctor",
            joinDate: new Date(
              patient.user.account_created_at,
            ).toLocaleDateString("en-US"),
          };
        });
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

const populateANALYTICS = async (user, admin, analyticData, res) => {
  const { analyticType, subCategory, office } = analyticData;
  try {
    let data;
    switch (analyticType) {
      case "DEMOGRAPHICS": {
        switch (subCategory) {
          case "GENDER": {
            const demographicStats = await sequelize.query(
              `
          SELECT 
            d.gender_id, 
            COUNT(d.gender_id) as count
          FROM demographics AS d
          INNER JOIN users AS u ON d.demographics_id = u.demographics_id
          ${office !== "all" ? "AND u.office_id = :office" : ""}
          GROUP BY d.gender_id
        `,
              {
                replacements: { office },
                type: QueryTypes.SELECT,
              },
            );

            data = demographicStats.map((stat) => ({
              name:
                stat.gender_id === 1
                  ? "Male"
                  : stat.gender_id === 2
                    ? "Female"
                    : stat.gender_id === 3
                      ? "Non-binary"
                      : stat.gender_id === 4
                        ? "Prefer not to say"
                        : "Other",
              value: parseInt(stat.count),
            }));
            break;
          }

          case "AGE": {
            const ageStats = await sequelize.query(
              `
          SELECT 
            CASE 
              WHEN TIMESTAMPDIFF(YEAR, d.dob, CURDATE()) < 18 THEN '0-17'
              WHEN TIMESTAMPDIFF(YEAR, d.dob, CURDATE()) < 30 THEN '18-29'
              WHEN TIMESTAMPDIFF(YEAR, d.dob, CURDATE()) < 50 THEN '30-49'
              WHEN TIMESTAMPDIFF(YEAR, d.dob, CURDATE()) < 70 THEN '50-69'
              ELSE '70+'
            END as age_group,
            COUNT(*) as count
          FROM demographics AS d
          INNER JOIN users AS u ON d.demographics_id = u.demographics_id
          WHERE u.user_role = 'PATIENT'
          ${office !== "all" ? "AND u.office_id = :office" : ""}
          GROUP BY age_group
          ORDER BY 
            CASE age_group
              WHEN '0-17' THEN 1
              WHEN '18-29' THEN 2
              WHEN '30-49' THEN 3
              WHEN '50-69' THEN 4
              WHEN '70+' THEN 5
            END
        `,
              {
                replacements: { office },
                type: QueryTypes.SELECT,
              },
            );

            data = ageStats.map((stat) => ({
              name: stat.age_group,
              value: parseInt(stat.count),
            }));
            break;
          }

          case "ETHNICITY": {
            const ethnicityStats = await sequelize.query(
              `
          SELECT 
            d.ethnicity_id,
            COUNT(d.ethnicity_id) as count
          FROM demographics AS d
          INNER JOIN users AS u ON d.demographics_id = u.demographics_id
          ${office !== "all" ? "AND u.office_id = :office" : ""}
          GROUP BY d.ethnicity_id
        `,
              {
                replacements: { office },
                type: QueryTypes.SELECT,
              },
            );

            data = ethnicityStats.map((stat) => ({
              name:
                stat.ethnicity_id === 1
                  ? "Hispanic or Latino"
                  : stat.ethnicity_id === 2
                    ? "Not Hispanic or Latino"
                    : "Prefer not to say",
              value: parseInt(stat.count),
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
        let baseQuery = `
    SELECT 
      u.user_role,
      CASE 
        WHEN u.user_role = 'PATIENT' THEN p.patient_fname
        WHEN u.user_role = 'DOCTOR' THEN doc.doctor_fname
        WHEN u.user_role = 'NURSE' THEN n.nurse_fname
        WHEN u.user_role = 'RECEPTIONIST' THEN r.receptionist_fname
        WHEN u.user_role = 'ADMIN' THEN a.admin_fname
      END as first_name,
      CASE 
        WHEN u.user_role = 'PATIENT' THEN p.patient_lname
        WHEN u.user_role = 'DOCTOR' THEN doc.doctor_lname
        WHEN u.user_role = 'NURSE' THEN n.nurse_lname
        WHEN u.user_role = 'RECEPTIONIST' THEN r.receptionist_lname
        WHEN u.user_role = 'ADMIN' THEN a.admin_lname
      END as last_name
  `;

        // Add specific fields based on subcategory
        if (subCategory === "AGE") {
          baseQuery += ", dem.dob";
        } else if (subCategory === "GENDER") {
          baseQuery += ", dem.gender_id";
        } else if (subCategory === "ETHNICITY") {
          baseQuery += ", dem.ethnicity_id";
        }

        baseQuery += `
    FROM demographics dem
    INNER JOIN users u ON dem.demographics_id = u.demographics_id
    LEFT JOIN patients p ON u.user_id = p.user_id
    LEFT JOIN doctors doc ON u.user_id = doc.user_id
    LEFT JOIN nurses n ON u.user_id = n.user_id
    LEFT JOIN receptionists r ON u.user_id = r.user_id
    LEFT JOIN admins a ON u.user_id = a.user_id
  `;

        // Add WHERE clause based on subcategory
        if (subCategory === "AGE") {
          baseQuery += `
      WHERE TIMESTAMPDIFF(YEAR, dem.dob, CURDATE()) >= 
        CASE 
          WHEN '${filter}' = '0-17' THEN 0
          WHEN '${filter}' = '18-29' THEN 1
          WHEN '${filter}' = '30-49' THEN 2
          WHEN '${filter}' = '50-69' THEN 3
          ELSE 70
        END
      AND TIMESTAMPDIFF(YEAR, dem.dob, CURDATE()) <= 
        CASE 
          WHEN '${filter}' = '0-17' THEN 17
          WHEN '${filter}' = '18-29' THEN 29
          WHEN '${filter}' = '30-49' THEN 49
          WHEN '${filter}' = '50-69' THEN 69
          ELSE 150
        END
    `;
        } else {
          baseQuery += `WHERE dem.${subCategory.toLowerCase()}_id = :demographicId`;
        }

        if (office !== "all") {
          baseQuery += " AND u.office_id = :office";
        }

        details = await sequelize.query(baseQuery, {
          replacements: {
            demographicId: logic.getDemographicId(subCategory, filter),
            office,
          },
          type: QueryTypes.SELECT,
        });
        break;
      }
      case "STAFF": {
        const baseQuery = `
          WITH StaffOffices AS (
            SELECT 
              'DOCTOR' as role,
              d.doctor_fname as first_name,
              d.doctor_lname as last_name,
              d.doctor_employee_id as employee_id,
              GROUP_CONCAT(DISTINCT o.office_name) as offices,
              GROUP_CONCAT(DISTINCT CONCAT(do.day_of_week, ': ', 
                TIME_FORMAT(do.shift_start, '%H:%i'), '-', 
                TIME_FORMAT(do.shift_end, '%H:%i'))) as schedules
            FROM doctors d
            LEFT JOIN doctor_offices do ON d.doctor_id = do.doctor_id
            LEFT JOIN office o ON do.office_id = o.office_id
            WHERE '${filter}' = 'DOCTOR'
            GROUP BY d.doctor_id
            
            UNION ALL
            
            SELECT 
              'NURSE' as role,
              n.nurse_fname,
              n.nurse_lname,
              n.nurse_employee_id,
              GROUP_CONCAT(DISTINCT o.office_name),
              GROUP_CONCAT(DISTINCT CONCAT(no.day_of_week, ': ',
                TIME_FORMAT(no.shift_start, '%H:%i'), '-',  
                TIME_FORMAT(no.shift_end, '%H:%i')))
            FROM nurses n
            LEFT JOIN nurse_offices no ON n.nurse_id = no.nurse_id
            LEFT JOIN office o ON no.office_id = o.office_id
            WHERE '${filter}' = 'NURSE'
            GROUP BY n.nurse_id
            
            UNION ALL
            
            SELECT 
              'RECEPTIONIST' as role,
              r.receptionist_fname,
              r.receptionist_lname,
              r.receptionist_employee_id,
              GROUP_CONCAT(DISTINCT o.office_name),
              GROUP_CONCAT(DISTINCT CONCAT(ro.day_of_week, ': ',
                TIME_FORMAT(ro.shift_start, '%H:%i'), '-',
                TIME_FORMAT(ro.shift_end, '%H:%i')))
            FROM receptionists r
            LEFT JOIN receptionist_offices ro ON r.receptionist_id = ro.receptionist_id
            LEFT JOIN office o ON ro.office_id = o.office_id
            WHERE '${filter}' = 'RECEPTIONIST'
            GROUP BY r.receptionist_id
          )
          SELECT * FROM StaffOffices
          ${office !== "all" ? "WHERE offices LIKE CONCAT('%', :officeName, '%')" : ""}
        `;

        const officeName =
          office !== "all"
            ? OFFICE_LIST.find((o) => o.office_id.toString() === office)
                ?.office_name
            : null;

        details = await sequelize.query(baseQuery, {
          replacements: { officeName },
          type: QueryTypes.SELECT,
        });
        break;
      }

      case "APPOINTMENTS": {
        const query = `
          SELECT 
            a.appointment_id,
            a.status,
            o.office_name,
            p.patient_fname,
            p.patient_lname,
            d.doctor_fname,
            d.doctor_lname,
            a.appointment_datetime
          FROM appointments a
          JOIN office o ON a.office_id = o.office_id
          JOIN patients p ON a.patient_id = p.patient_id
          JOIN doctors d ON a.doctor_id = d.doctor_id
          WHERE a.status = :status
          ${office !== "all" ? "AND a.office_id = :office" : ""}
        `;

        details = await sequelize.query(query, {
          replacements: {
            status: filter,
            office,
          },
          type: QueryTypes.SELECT,
        });
        break;
      }
      case "BILLING": {
        switch (subCategory) {
          case "PAYMENT_STATUS": {
            const query = `
              SELECT 
                b.billing_id,
                b.amount_due,
                b.amount_paid,
                b.payment_status,
                b.created_at,
                p.patient_id,
                p.patient_fname,
                p.patient_lname,
                r.receptionist_fname as handled_by_fname,
                r.receptionist_lname as handled_by_lname
              FROM billing b
              JOIN patients p ON b.patient_id = p.patient_id
              LEFT JOIN receptionists r ON b.handled_by = r.receptionist_id
              WHERE b.payment_status = :status
              ${office !== "all" ? "AND b.office_id = :office" : ""}
            `;

            details = await sequelize.query(query, {
              replacements: {
                status: filter,
                office,
              },
              type: QueryTypes.SELECT,
            });
            break;
          }

          case "REVENUE": {
            const query = `
              SELECT 
                b.billing_id,
                b.amount_due,
                b.amount_paid,
                DATE_FORMAT(b.created_at, '%Y-%m') as month,
                p.patient_fname,
                p.patient_lname
              FROM billing b
              JOIN patients p ON b.patient_id = p.patient_id
              WHERE DATE_FORMAT(b.created_at, '%Y-%m') = :month
              ${office !== "all" ? "AND b.office_id = :office" : ""}
            `;

            details = await sequelize.query(query, {
              replacements: {
                month: filter,
                office,
              },
              type: QueryTypes.SELECT,
            });
            break;
          }
        }
        break;
      }
    }

    res.json({ details });
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({
      message: "Error fetching details",
      error: error.message,
    });
  }
};

const adminDashboard = {
  populateOVERVIEW,
  populateUSERMANAGEMENT,
  populateANALYTICS,
  getAnalyticsDetails,
};
export default adminDashboard;
