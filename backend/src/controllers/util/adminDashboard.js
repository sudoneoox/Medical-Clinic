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

        console.log(patients[0].doctors[0].PatientDoctor);
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
            // primaryDoctor: primaryDoctor
            //   ? `Dr. ${primaryDoctor.doctor_fname} ${primaryDoctor.doctor_lname}`
            //   : "No Primary Doctor",
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
  const { analyticType, subCategory, office, dateRange, role, status } =
    analyticData;
  console.log("RECEIVED PARAMETERS INSIDE populateANALYTICS", analyticData);
  try {
    let data;

    switch (analyticType) {
      case "DEMOGRAPHICS": {
        switch (subCategory) {
          case "GENDER": {
            const replacements = {
              office,
              ...(dateRange && {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
              }),
              ...(role !== "all" && { role }),
            };

            const demographicStats = await sequelize.query(
              `
          SELECT 
            d.gender_id, 
            COUNT(d.gender_id) as count
          FROM demographics AS d
          INNER JOIN users AS u ON d.demographics_id = u.demographics_id
          WHERE 1=1
          ${office !== "all" ? "AND u.office_id = :office" : ""}
          ${dateRange ? "AND u.account_created_at BETWEEN :startDate AND :endDate" : ""}
          ${role !== "all" ? "AND u.user_role = :role" : ""}
          GROUP BY d.gender_id
        `,
              {
                replacements,
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
            const replacements = {
              office,
              ...(dateRange && {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
              }),
              ...(role !== "all" && { role }),
            };
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
          WHERE 1=1
          ${office !== "all" ? "AND u.office_id = :office" : ""}
          ${dateRange ? "AND u.account_created_at BETWEEN :startDate AND :endDate" : ""}
          ${role !== "all" ? "AND u.user_role = :role" : ""}
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
                replacements,
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
            const replacements = {
              office,
              ...(dateRange && {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
              }),
              ...(role !== "all" && { role }),
            };

            const ethnicityStats = await sequelize.query(
              `
              SELECT 
                d.ethnicity_id,
                COUNT(d.ethnicity_id) as count
              FROM demographics AS d
              INNER JOIN users AS u ON d.demographics_id = u.demographics_id
              ${office !== "all" ? "AND u.office_id = :office" : ""}
              ${dateRange ? "AND u.account_created_at BETWEEN :startDate AND :endDate" : ""}
              ${role !== "all" ? "AND u.user_role = :role" : ""}
              GROUP BY d.ethnicity_id
              `,
              {
                replacements,
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
        const replacements = {
          office: office === "all" ? null : office,
          ...(dateRange && {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
          role: role === "all" ? null : role,
          status: status === "all" ? null : status,
        };
        const query = `
          SELECT 
            role,
            COUNT(*) as count
          FROM (
            SELECT 
              'Doctors' as role, 
              d.doctor_id as id,
              do.office_id
            FROM doctors d
            LEFT JOIN doctor_offices do ON d.doctor_id = do.doctor_id
            WHERE 1=1
            ${office !== "all" ? "AND do.office_id = :office" : ""}
            ${dateRange ? "AND d.created_at BETWEEN :startDate AND :endDate" : ""}

            UNION ALL

            SELECT 
              'Nurses' as role, 
              n.nurse_id as id,
              no.office_id
            FROM nurses n
            LEFT JOIN nurse_offices no ON n.nurse_id = no.nurse_id
            WHERE 1=1
            ${office !== "all" ? "AND no.office_id = :office" : ""}
            ${dateRange ? "AND n.created_at BETWEEN :startDate AND :endDate" : ""}

            UNION ALL

            SELECT 
              'Receptionists' as role, 
              r.receptionist_id as id,
              ro.office_id
            FROM receptionists r
            LEFT JOIN receptionist_offices ro ON r.receptionist_id = ro.receptionist_id
            WHERE 1=1
            ${office !== "all" ? "AND ro.office_id = :office" : ""}
            ${dateRange ? "AND r.created_at BETWEEN :startDate AND :endDate" : ""}
          ) as staff
          GROUP BY role
        `;
        const staffStats = await sequelize.query(query, {
          replacements,
          type: QueryTypes.SELECT,
        });

        data = staffStats.map((stat) => ({
          name: stat.role,
          value: parseInt(stat.count),
        }));
        break;
      }

      case "APPOINTMENTS": {
        const replacements = {
          office: office === "all" ? null : office,
          ...(dateRange && {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
          status: status === "all" ? null : status,
        };

        const appointmentStats = await sequelize.query(
          `
          SELECT 
            status,
            COUNT(*) as count
          FROM appointments a
          WHERE 1=1
          ${office !== "all" ? "AND a.office_id = :office" : ""}
          ${dateRange ? "AND a.appointment_datetime BETWEEN :startDate AND :endDate" : ""}
          ${status !== "all" ? "AND a.status = :status" : ""}
          GROUP BY status
          `,
          {
            replacements,
            type: QueryTypes.SELECT,
          },
        );

        data = appointmentStats.map((stat) => ({
          name: stat.status,
          value: parseInt(stat.count),
        }));
        break;
      }

      case "BILLING": {
        const replacements = {
          office: office === "all" ? null : office,
          ...(dateRange && {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
          status: status === "all" ? null : status,
        };
        switch (subCategory) {
          case "PAYMENT_STATUS": {
            const billingStats = await sequelize.query(
              `
              SELECT 
                payment_status,
                COUNT(*) as count,
                SUM(amount_due) as total_amount
              FROM billing b
              WHERE 1=1
              ${office !== "all" ? "AND b.office_id = :office" : ""}
              ${dateRange ? "AND b.created_at BETWEEN :startDate AND :endDate" : ""}
              ${status !== "all" ? "AND b.payment_status = :status" : ""}
              GROUP BY payment_status
              `,
              {
                replacements,
                type: QueryTypes.SELECT,
              },
            );

            data = billingStats.map((stat) => ({
              name: stat.payment_status,
              value: parseInt(stat.count),
              amount: parseFloat(stat.total_amount),
            }));
            break;
          }

          case "REVENUE": {
            const revenueStats = await sequelize.query(
              `
              SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                SUM(amount_paid) as total_revenue
              FROM billing b
              WHERE payment_status = 'PAID'
              ${office !== "all" ? "AND b.office_id = :office" : ""}
              ${dateRange ? "AND b.created_at BETWEEN :startDate AND :endDate" : ""}
              GROUP BY DATE_FORMAT(created_at, '%Y-%m')
              ORDER BY month DESC
              LIMIT 12
              `,
              {
                replacements,
                type: QueryTypes.SELECT,
              },
            );

            data = revenueStats.map((stat) => ({
              name: stat.month,
              value: parseFloat(stat.total_revenue),
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
  console.log("RECEIVED IN getAnalyticsDetails", req.body.analyticData);
  const { analyticType, subCategory, office, filter, dateRange, status, role } =
    req.body.analyticData;
  try {
    let details;
    switch (analyticType) {
      case "DEMOGRAPHICS": {
        const baseQuery = `
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
            ${subCategory === "AGE" ? ", dem.dob" : ""}
            ${subCategory === "GENDER" ? ", dem.gender_id" : ""}
            ${subCategory === "ETHNICITY" ? ", dem.ethnicity_id" : ""}
          FROM demographics dem
          INNER JOIN users u ON dem.demographics_id = u.demographics_id
          LEFT JOIN patients p ON u.user_id = p.user_id
          LEFT JOIN doctors doc ON u.user_id = doc.user_id
          LEFT JOIN nurses n ON u.user_id = n.user_id
          LEFT JOIN receptionists r ON u.user_id = r.user_id
          LEFT JOIN admins a ON u.user_id = a.user_id
          WHERE 1=1
          ${office !== "all" ? "AND u.office_id = :office" : ""}
          ${role !== "all" ? "AND u.user_role = :role" : ""}
          ${dateRange ? "AND u.account_created_at BETWEEN :startDate AND :endDate" : ""}
          ${
            subCategory === "AGE"
              ? `AND TIMESTAMPDIFF(YEAR, dem.dob, CURDATE()) >= 
                  CASE 
                    WHEN :filter = '0-17' THEN 0
                    WHEN :filter = '18-29' THEN 18
                    WHEN :filter = '30-49' THEN 30
                    WHEN :filter = '50-69' THEN 50
                    ELSE 70
                  END
                AND TIMESTAMPDIFF(YEAR, dem.dob, CURDATE()) <= 
                  CASE 
                    WHEN :filter = '0-17' THEN 17
                    WHEN :filter = '18-29' THEN 29
                    WHEN :filter = '30-49' THEN 49
                    WHEN :filter = '50-69' THEN 69
                    ELSE 150
                  END`
              : `AND dem.${subCategory.toLowerCase()}_id = (
                  CASE 
                    WHEN :filter = 'Male' THEN 1
                    WHEN :filter = 'Female' THEN 2
                    WHEN :filter = 'Non-binary' THEN 3
                    WHEN :filter = 'Prefer not to say' THEN 4
                    WHEN :filter = 'Hispanic or Latino' THEN 1
                    WHEN :filter = 'Not Hispanic or Latino' THEN 2
                    ELSE 3
                  END
                )`
          }
        `;

        const replacements = {
          office: office === "all" ? undefined : office,
          filter,
          role: role === "all" ? undefined : role,
          ...(dateRange && {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
        };

        details = await sequelize.query(baseQuery, {
          replacements,
          type: QueryTypes.SELECT,
        });
        break;
      }
      case "STAFF": {
        const staffType = filter.slice(0, -1).toUpperCase();
        const baseQuery = `
          SELECT 
            :staffType as role,
            CASE 
              WHEN :staffType = 'DOCTOR' THEN d.doctor_fname
              WHEN :staffType = 'NURSE' THEN n.nurse_fname
              WHEN :staffType = 'RECEPTIONIST' THEN r.receptionist_fname
            END as first_name,
            CASE 
              WHEN :staffType = 'DOCTOR' THEN d.doctor_lname
              WHEN :staffType = 'NURSE' THEN n.nurse_lname
              WHEN :staffType = 'RECEPTIONIST' THEN r.receptionist_lname
            END as last_name,
            CASE 
              WHEN :staffType = 'DOCTOR' THEN d.doctor_employee_id
              WHEN :staffType = 'NURSE' THEN n.nurse_employee_id
              WHEN :staffType = 'RECEPTIONIST' THEN r.receptionist_employee_id
            END as employee_id,
            GROUP_CONCAT(DISTINCT o.office_name) as offices,
            GROUP_CONCAT(DISTINCT CONCAT(
              CASE 
                WHEN :staffType = 'DOCTOR' THEN do.day_of_week
                WHEN :staffType = 'NURSE' THEN no.day_of_week
                WHEN :staffType = 'RECEPTIONIST' THEN ro.day_of_week
              END,
              ': ',
              CASE 
                WHEN :staffType = 'DOCTOR' THEN TIME_FORMAT(do.shift_start, '%H:%i')
                WHEN :staffType = 'NURSE' THEN TIME_FORMAT(no.shift_start, '%H:%i')
                WHEN :staffType = 'RECEPTIONIST' THEN TIME_FORMAT(ro.shift_start, '%H:%i')
              END,
              '-',
              CASE 
                WHEN :staffType = 'DOCTOR' THEN TIME_FORMAT(do.shift_end, '%H:%i')
                WHEN :staffType = 'NURSE' THEN TIME_FORMAT(no.shift_end, '%H:%i')
                WHEN :staffType = 'RECEPTIONIST' THEN TIME_FORMAT(ro.shift_end, '%H:%i')
              END
            )) as schedules
          FROM (
            SELECT doctor_id as id, doctor_fname, doctor_lname, doctor_employee_id, created_at 
            FROM doctors WHERE :staffType = 'DOCTOR'
            UNION ALL
            SELECT nurse_id, nurse_fname, nurse_lname, nurse_employee_id, created_at 
            FROM nurses WHERE :staffType = 'NURSE'
            UNION ALL
            SELECT receptionist_id, receptionist_fname, receptionist_lname, receptionist_employee_id, created_at 
            FROM receptionists WHERE :staffType = 'RECEPTIONIST'
          ) staff
          LEFT JOIN doctors d ON staff.id = d.doctor_id AND :staffType = 'DOCTOR'
          LEFT JOIN nurses n ON staff.id = n.nurse_id AND :staffType = 'NURSE'
          LEFT JOIN receptionists r ON staff.id = r.receptionist_id AND :staffType = 'RECEPTIONIST'
          LEFT JOIN doctor_offices do ON d.doctor_id = do.doctor_id AND :staffType = 'DOCTOR'
          LEFT JOIN nurse_offices no ON n.nurse_id = no.nurse_id AND :staffType = 'NURSE'
          LEFT JOIN receptionist_offices ro ON r.receptionist_id = ro.receptionist_id AND :staffType = 'RECEPTIONIST'
          LEFT JOIN office o ON 
            (do.office_id = o.office_id AND :staffType = 'DOCTOR') OR
            (no.office_id = o.office_id AND :staffType = 'NURSE') OR
            (ro.office_id = o.office_id AND :staffType = 'RECEPTIONIST')
          WHERE 1=1
          ${office !== "all" ? "AND o.office_id = :office" : ""}
          ${dateRange ? "AND staff.created_at BETWEEN :startDate AND :endDate" : ""}
          GROUP BY 
            CASE 
              WHEN :staffType = 'DOCTOR' THEN d.doctor_id
              WHEN :staffType = 'NURSE' THEN n.nurse_id
              WHEN :staffType = 'RECEPTIONIST' THEN r.receptionist_id
            END
          ORDER BY first_name, last_name
        `;

        const replacements = {
          staffType,
          office: office === "all" ? undefined : office,
          ...(dateRange && {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
        };

        details = await sequelize.query(baseQuery, {
          replacements,
          type: QueryTypes.SELECT,
        });
        break;
      }

      case "APPOINTMENTS": {
        const baseQuery = `
          SELECT 
            a.appointment_id,
            a.status,
            o.office_name,
            p.patient_fname,
            p.patient_lname,
            d.doctor_fname,
            d.doctor_lname,
            a.appointment_datetime,
            a.reason
          FROM appointments a
          JOIN office o ON a.office_id = o.office_id
          JOIN patients p ON a.patient_id = p.patient_id
          JOIN doctors d ON a.doctor_id = d.doctor_id
          WHERE a.status = :status
          ${office !== "all" ? "AND a.office_id = :office" : ""}
          ${dateRange ? "AND a.appointment_datetime BETWEEN :startDate AND :endDate" : ""}
          ORDER BY a.appointment_datetime DESC
        `;

        const replacements = {
          status: filter,
          office: office === "all" ? undefined : office,
          ...(dateRange && {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
        };

        details = await sequelize.query(baseQuery, {
          replacements,
          type: QueryTypes.SELECT,
        });
        break;
      }
      case "BILLING": {
        const baseQuery =
          subCategory === "PAYMENT_STATUS"
            ? `
      SELECT 
        b.billing_id,
        b.amount_due,
        b.amount_paid,
        b.payment_status,
        b.created_at,
        p.patient_fname,
        p.patient_lname,
        r.receptionist_fname as handled_by_fname,
        r.receptionist_lname as handled_by_lname
      FROM billing b
      JOIN patients p ON b.patient_id = p.patient_id
      LEFT JOIN receptionists r ON b.handled_by = r.receptionist_id
      WHERE b.payment_status = :status
      ${office !== "all" ? "AND b.office_id = :office" : ""}
      ${dateRange ? "AND b.created_at BETWEEN :startDate AND :endDate" : ""}
      ORDER BY b.created_at DESC
    `
            : `
      SELECT 
        b.billing_id,
        b.amount_paid,
        DATE_FORMAT(b.created_at, '%Y-%m') as month,
        b.created_at,
        p.patient_fname,
        p.patient_lname
      FROM billing b
      JOIN patients p ON b.patient_id = p.patient_id
      WHERE DATE_FORMAT(b.created_at, '%Y-%m') = :month
        AND b.payment_status = 'PAID'
        ${office !== "all" ? "AND b.office_id = :office" : ""}
        ${dateRange ? "AND b.created_at BETWEEN :startDate AND :endDate" : ""}
      ORDER BY b.created_at DESC
    `;

        const replacements = {
          status: filter,
          month: filter,
          office: office === "all" ? undefined : office,
          ...(dateRange && {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          }),
        };

        details = await sequelize.query(baseQuery, {
          replacements,
          type: QueryTypes.SELECT,
        });
        break;
      }
      default:
        throw new Error("Invallid analytics type");
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

const deleteUser = async (req, res) => {
  try {
    console.log(
      " LOOOOOOK HEERE DELETIN USER WITH EMAIL",
      req.body.targetUserEmail,
    );
    Users.destroy({
      where: {
        user_email: req.body.targetUserEmail,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("ERROR IN DELETING USER", error);
    res.status(500).json({
      success: false,
    });
  }
};

const adminDashboard = {
  populateOVERVIEW,
  populateUSERMANAGEMENT,
  populateANALYTICS,
  getAnalyticsDetails,
  deleteUser,
};
export default adminDashboard;
