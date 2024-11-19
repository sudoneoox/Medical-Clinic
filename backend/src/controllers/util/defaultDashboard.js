import Doctor from "../../models/Tables/Doctor.js";
import Appointment from "../../models/Tables/Appointment.js";
import Specialty from "../../models/Tables/Specialties.js";
import DoctorSpecialties from "../../models/Tables/DoctorSpecialties.js";
import Office from "../../models/Tables/Office.js";
import SpecialistApproval from "../../models/Tables/SpecialistApproval.js";
import Patient from "../../models/Tables/Patient.js";
import PatientDoctor from "../../models/Tables/PatientDoctor.js";
import DoctorOffices from "../../models/Tables/DoctorOffices.js";
import User from "../../models/Tables/Users.js";
import DoctorAvailibility from "../../models/Tables/AvailableDoctors.js";
import Nurse from "../../models/Tables/Nurse.js";
import NurseOffices from "../../models/Tables/NurseOffices.js";
import { Op } from "@sequelize/core";
import TimeSlots from "../../models/Tables/TimeSlots.js";
import sequelize from "../../config/database.js";
import Receptionist from "../../models/Tables/Receptionist.js";

const updateSETTINGS = async (user, relatedEntity, settingsData, res) => {
  const { section, data } = settingsData;

  try {
    switch (section) {
      case "account":
        // Check email uniqueness
        if (data.email) {
          const existingEmail = await User.findOne({
            where: {
              user_email: data.email,
              user_id: { [Op.ne]: user.user_id }, // Exclude current user
              is_deleted: 0,
            },
          });
          if (existingEmail) {
            return res.status(400).json({
              success: false,
              message: "This email is already registered to another account.",
            });
          }
        }

        // Check username uniqueness
        if (data.username) {
          const existingUsername = await User.findOne({
            where: {
              user_username: data.username,
              user_id: { [Op.ne]: user.user_id }, // Exclude current user
              is_deleted: 0,
            },
          });
          if (existingUsername) {
            return res.status(400).json({
              success: false,
              message: "This username is already taken.",
            });
          }
        }

        // Phone validation
        if (data.phone && !data.phone.match(/^\d{3}-\d{3}-\d{4}$/)) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid phone number format. Please use XXX-XXX-XXXX format.",
          });
        }

        // Update user account information
        const updateFields = {};

        if (data.email) {
          updateFields.user_email = data.email;
        }

        if (data.phone) {
          updateFields.user_phone = data.phone;
        }

        if (data.username) {
          updateFields.user_username = data.username;
        }

        if (data.email || data.phone || data.username) {
          await User.update(updateFields, { where: { user_id: user.user_id } });
        }
        break;

      case "password":
        // password validation

        // Get current user's password
        const currentUser = await User.findByPk(user.user_id);

        // Verify current password matches
        if (currentUser.user_password !== data.currentPassword) {
          return res.status(400).json({
            success: false,
            message: "Current password is incorrect.",
          });
        }

        // Verify if new password matches confirm password
        if (data.newPassword !== data.confirmPassword) {
          return res.status(400).json({
            success: false,
            message: "New passwords do not match.",
          });
        }

        await User.update(
          { user_password: data.newPassword },
          { where: { user_id: user.user_id } },
        );
        break;

      case "emergency":
        if (user.user_role !== "PATIENT") {
          return res.status(403).json({
            success: false,
            message: "Only patients can update emergency contacts",
          });
        }

        // TODO: later check
        for (const contact of data.contacts) {
          if (!contact.name || !contact.relationship || !contact.phone) {
            return res.status(400).json({
              success: false,
              message: "All emergency contact fields are required",
            });
          }

          if (!contact.phone.match(/^\d{3}-\d{3}-\d{4}$/)) {
            return res.status(400).json({
              success: false,
              message:
                "Invalid phone format for emergency contact. Please use XXX-XXX-XXXX format.",
            });
          }
        }

        // Update emergency contacts
        await Patient.update(
          { emergency_contacts: JSON.stringify(data.contacts) },
          { where: { user_id: user.user_id } },
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          message: `Invalid settings section: ${section}`,
        });
    }

    res.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating settings. Please try again.",
    });
  }
};

const populateMYAPPOINTMENTS = async (
  user,
  relatedEntity,
  appointmentData,
  res,
) => {
  const { appointmentType, action } = appointmentData;
  console.log("RECEIVED INSIDE populateAPPOINTMENTS");

  try {
    let data;
    switch (user.user_role) {
      case "PATIENT": {
        switch (appointmentType) {
          case "CURRENT": {
            // Fixed Doctor association includes
            data = await Appointment.findAll({
              where: {
                patient_id: relatedEntity.patient_id,
                status: "CONFIRMED",
                appointment_datetime: {
                  [Op.gt]: new Date(),
                },
              },
              include: [
                {
                  model: Doctor,
                  include: [
                    {
                      model: Specialty,
                      through: DoctorSpecialties,
                    },
                  ],
                },
                {
                  model: Office,
                  attributes: ["office_name", "office_address"],
                },
              ],
              order: [["appointment_datetime", "ASC"]],
            });
            break;
          }
          case "PENDING": {
            data = await Appointment.findAll({
              where: {
                patient_id: relatedEntity.patient_id,
                status: "PENDING_DOCTOR_APPROVAL",
              },
              include: [
                {
                  model: Doctor,
                  include: [
                    {
                      model: Specialty,
                      through: DoctorSpecialties,
                    },
                  ],
                },
                {
                  model: Office,
                  attributes: ["office_name", "office_address"],
                },
              ],
              order: [["created_at", "DESC"]],
            });
            break;
          }

          case "AVAILABLE_DOCTORS": {
            data = await Doctor.findAll({
              include: [
                {
                  model: Specialty,
                  through: DoctorSpecialties,
                  attributes: ["specialty_name", "specialty_code"],
                },
                {
                  model: Office,
                  through: DoctorOffices,
                  attributes: ["office_name", "office_address"],
                },
                {
                  model: DoctorAvailibility,
                  include: [
                    {
                      model: TimeSlots,
                      attributes: ["start_time", "end_time"],
                    },
                  ],
                  where: {
                    is_available: 1,
                    // if date is null, its a weekly occuring slot,
                    [Op.or]: [
                      { specific_date: null },
                      { specific_date: { [Op.gte]: new Date() } },
                    ],
                  },
                },
                {
                  model: User,
                  where: { is_deleted: 0 },
                },
              ],
              attributes: [
                "doctor_id",
                "doctor_fname",
                "doctor_lname",
                [
                  sequelize.literal(`(
                  SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'day', day_of_week,
                            'office_name', office_name,
                            'office_address', office_address,
                            'time_slots', time_slots
                        )
                    )
                    FROM doctor_available_slots
                    WHERE doctor_id = Doctor.doctor_id
                )`),
                  "availability",
                ],
              ],
            });
            break;
          }
          default:
            throw new Error("Invalid appointment type for patient");
        }
        break;
      }
      case "RECEPTIONIST": {
        switch (appointmentType) {
          // case "CURRENT": {
          //   // Fixed Doctor association includes
          //   data = await Appointment.findAll({
          //     where: {
          //       patient_id: relatedEntity.patient_id,
          //       status: "CONFIRMED",
          //       appointment_datetime: {
          //         [Op.gt]: new Date(),
          //       },
          //     },
          //     include: [
          //       {
          //         model: Doctor,
          //         include: [
          //           {
          //             model: Specialty,
          //             through: DoctorSpecialties,
          //           },
          //         ],
          //       },
          //       {
          //         model: Office,
          //         attributes: ["office_name", "office_address"],
          //       },
          //     ],
          //     order: [["appointment_datetime", "ASC"]],
          //   });
          //   break;
          // }
          // case "PENDING": {
          //   data = await Appointment.findAll({
          //     where: {
          //       patient_id: relatedEntity.patient_id,
          //       status: "PENDING_DOCTOR_APPROVAL",
          //     },
          //     include: [
          //       {
          //         model: Doctor,
          //         include: [
          //           {
          //             model: Specialty,
          //             through: DoctorSpecialties,
          //           },
          //         ],
          //       },
          //       {
          //         model: Office,
          //         attributes: ["office_name", "office_address"],
          //       },
          //     ],
          //     order: [["created_at", "DESC"]],
          //   });
          //   break;
          // }
          case "AVAILABLE_DOCTORS": {
            data = await Doctor.findAll({
              include: [
                {
                  model: Specialty,
                  through: DoctorSpecialties,
                  attributes: ["specialty_name", "specialty_code"],
                },
                {
                  model: Office,
                  through: DoctorOffices,
                  attributes: ["office_name", "office_address"],
                },
                {
                  model: DoctorAvailibility,
                  include: [
                    {
                      model: TimeSlots,
                      attributes: ["start_time", "end_time"],
                    },
                  ],
                  where: {
                    is_available: 1,
                    // if date is null, its a weekly occuring slot,
                    [Op.or]: [
                      { specific_date: null },
                      { specific_date: { [Op.gte]: new Date() } },
                    ],
                  },
                },
                {
                  model: User,
                  where: { is_deleted: 0 },
                },
              ],
              attributes: [
                "doctor_id",
                "doctor_fname",
                "doctor_lname",
                [
                  sequelize.literal(`(
                  SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'day', day_of_week,
                            'office_name', office_name,
                            'office_address', office_address,
                            'time_slots', time_slots
                        )
                    )
                    FROM doctor_available_slots
                    WHERE doctor_id = Doctor.doctor_id
                )`),
                  "availability",
                ],
              ],
            });
            break;
          }
          default:
            throw new Error("Invalid appointment type for patient");
        }
        break;
      }
      case "DOCTOR": {
        switch (appointmentType) {
          case "UPCOMING": {
            // Get doctor's upcoming appointments
            data = await Appointment.findAll({
              where: {
                doctor_id: relatedEntity.doctor_id,
                status: "CONFIRMED",
                appointment_datetime: {
                  [Op.gt]: new Date(),
                },
              },
              include: [
                {
                  model: Patient,
                  attributes: ["patient_fname", "patient_lname"],
                },
                {
                  model: Office,
                  attributes: ["office_name", "office_address"],
                },
              ],
              order: [["appointment_datetime", "ASC"]],
            });
            break;
          }
          case "PENDING_APPROVALS": {
            console.log(
              "Fetching PENDING_APPROVALS for doctor:",
              relatedEntity.doctor_id,
            );

            data = await SpecialistApproval.findAll({
              where: {
                reffered_doctor_id: relatedEntity.doctor_id,
                specialist_status: "PENDING",
              },
              include: [
                {
                  model: Patient,
                  attributes: ["patient_fname", "patient_lname"],
                },
                {
                  model: Doctor,
                  as: "specialist",
                  include: [
                    {
                      model: Specialty,
                      through: DoctorSpecialties,
                    },
                  ],
                },
                {
                  model: Appointment,
                  include: [
                    {
                      model: Office,
                      attributes: ["office_name", "office_address"],
                    },
                  ],
                },
              ],
              order: [["requested_at", "DESC"]],
            });

            console.log("Raw specialist approvals:", data);

            // Transform the data to match what AppointmentCard expects
            data = data.map((approval) => ({
              approval_id: approval.approval_id,
              appointment_id: approval.appointment.appointment_id,
              patient: approval.patient,
              doctor: approval.specialist,
              office: approval.appointment.office,
              status: "PENDING_DOCTOR_APPROVAL",
              appointment_datetime: approval.appointment.appointment_datetime,
              duration: approval.appointment.duration,
              reason: approval.reason,
              requested_at: approval.requested_at,
              reffered_doctor_id: approval.reffered_doctor_id, // Include this!
            }));

            console.log("Transformed approval data:", data);
            break;
          }
          case "SPECIALIST_REQUESTS": {
            // First get specialist approvals, then get corresponding appointments
            const approvals = await SpecialistApproval.findAll({
              where: {
                specialist_id: relatedEntity.doctor_id,
                specialist_status: "APPROVED",
              },
              attributes: ["patient_id"],
            });

            const patientIds = approvals.map((a) => a.patient_id);

            data = await Appointment.findAll({
              where: {
                doctor_id: relatedEntity.doctor_id,
                status: "PENDING",
                patient_id: {
                  [Op.in]: patientIds,
                },
              },
              include: [
                {
                  model: Patient,
                  attributes: ["patient_fname", "patient_lname"],
                },
              ],
              order: [["created_at", "DESC"]],
            });
            break;
          }
          default:
            throw new Error("Invalid appointment type for doctor");
        }
        break;
      }
      default:
        throw new Error(`Invalid user role ${user.user_role} for appointments`);
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

const submitNewAppointment = async (req, res) => {
  // const { user_id, doctor_id, office_name, appointment_datetime } = req.body;
  const user_id = req.body.user_id;
  const doctor_id = req.body.doctor_id;
  const office_name = req.body.office_name;
  const appointment_datetime = req.body.appointment_datetime;
  const userRole = req.body.user_role;
  let patientId;
  let recepId;
  try {
    // Get patient_id from user_id
    if (userRole === "RECEPTIONIST") {
      patientId = req.body.patientId;
      const receptionist = await Receptionist.findOne({
        where: { user_id: user_id },
        include: [
          {
            model: User,
            where: { is_deleted: 0 },
          },
        ],
      });
      recepId = receptionist.receptionist_id;
    } else {
      const patient = await Patient.findOne({
        where: { user_id: user_id },
        include: [
          {
            model: User,
            where: { is_deleted: 0 },
          },
        ],
      });
      if (patient) {
        patientId = patient.patient_id;
      }
    }

    // Get office_id from office_name
    const office = await Office.findOne({
      where: { office_name: office_name },
    });

    // get random nurse from office
    const nurse = await Nurse.findOne({
      include: {
        model: User,
        where: { is_deleted: 0 },
      },
      order: sequelize.random(),
      limit: 1,
    });

    console.log("Selected attending nurse:", nurse.toJSON()); // For debugging

    // format datetime for mysql
    const formattedDateTime = new Date(appointment_datetime)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Create the appointment
    let appointment;
    if (userRole === "RECEPTIONIST") {
      appointment = await Appointment.create({
        patient_id: patientId,
        doctor_id,
        office_id: office.office_id,
        appointment_datetime: formattedDateTime,
        duration: "00:30:00", // Default 30 min duration
        status: "CONFIRMED",
        reason: req.body.reason || "Regular checkup",
        attending_nurse: nurse.nurse_id,
        booked_by: recepId,
      });
    } else {
      appointment = await Appointment.create({
        patient_id: patientId,
        doctor_id,
        office_id: office.office_id,
        appointment_datetime: formattedDateTime,
        duration: "00:30:00", // Default 30 min duration
        status: "CONFIRMED",
        reason: req.body.reason || "Regular checkup",
        attending_nurse: nurse.nurse_id,
      });
    }

    res.json({
      success: true,
      data: appointment,
      attending_nurse: nurse,
    });
  } catch (error) {
    console.error("Appointment creation error", error);
    // The specialist approval trigger will throw SPECIALIST_APPROVAL_REQUIRED
    const errorMessage =
      error.original?.sqlMessage || error.parent?.sqlMessage || error.message;
    if (errorMessage.includes("SPECIALIST_APPROVAL_REQUIRED")) {
      return res.status(400).json({
        success: false,
        message: "SPECIALIST_APPROVAL_REQUIRED",
      });
    }
    if (errorMessage.includes("BILLING_LIMIT_REACHED")) {
      res.status(400).json({
        success: false,
        message: "BILLING_LIMIT_REACHED",
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || "Error creating appointment",
      });
    }
  }
};

const requestSpecialistApproval = async (req, res) => {
  let {
    user_id,
    specialist_id,
    primary_doctor_id,
    reason,
    appointment_datetime,
    office_name,
  } = req.body;
  const userRole = req.body.userRole;
  let patientId;
  try {
    // Get patient_id from user_id
    let receptionist;
    if (userRole === "RECEPTIONIST") {
      patientId = req.body.patientId;
      receptionist = await Receptionist.findOne({
        where: { user_id: user_id },
      });
    } else {
      const patient = await Patient.findOne({
        where: { user_id },
        include: [
          {
            model: User,
            where: { is_deleted: 0 },
          },
        ],
      });
      if (patient) {
        patientId = patient.patient_id;
      }
      user_id = null;
    }

    // Get office_id from office_name
    const office = await Office.findOne({
      where: { office_name },
    });

    const nurse = await Nurse.findOne({
      include: {
        model: User,
        where: { is_deleted: 0 },
      },
      order: sequelize.random(),
      limit: 1,
    });

    // create a pending appointment
    const appointment = await Appointment.create(
      {
        patient_id: patientId,
        doctor_id: specialist_id,
        office_id: office.office_id,
        appointment_datetime,
        duration: "00:30:00", // Default 30 min duration
        status: "PENDING_DOCTOR_APPROVAL",
        reason: reason,
        attending_nurse: nurse.nurse_id,
      },
      {
        hooks: false,
      },
    );
    if (userRole === "RECEPTIONIST") {
      appointment.booked_by = receptionist.receptionist_id;
      appointment.save();
    }
    // Create the specialist approval request
    console.log("PRIMARY DOCTOR IN SPECIALIST APPROVAL", primary_doctor_id);
    const approvalRequest = await SpecialistApproval.create({
      appointment_id: appointment.appointment_id,
      patient_id: patientId,
      specialist_id: specialist_id,
      reffered_doctor_id: primary_doctor_id,
      reason: reason,
      specialist_status: "PENDING",
    });

    res.json({
      success: true,
      data: {
        appointment,
        approvalRequest,
      },
    });
  } catch (error) {
    console.error("Error requesting specialist approval:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error requesting specialist approval",
    });
  }
};

const getPrimaryDoctor = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const userRole = req.body.userRole;
    let patientId;
    // First get patient_id from user_id

    if (userRole === "RECEPTIONIST") {
      patientId = req.body.patientId;
    } else {
      const patient = await Patient.findOne({
        where: { user_id },
        include: [
          {
            model: User,
            where: { is_deleted: 0 },
          },
        ],
      });
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found",
        });
      }
      patientId = patient.patient_id;
    }

    let doctorRelation = await PatientDoctor.findOne({
      where: {
        patient_id: patientId, // Use patient_id instead of user_id
        is_primary: 1,
      },
      include: [
        {
          model: Doctor,
          include: [
            {
              model: User,
              where: { is_deleted: 0 },
            },
          ],
        },
      ],
    });

    if (!doctorRelation) {
      return res.status(404).json({
        success: false,
        message: "Primary doctor not found",
      });
    }

    res.json({
      success: true,
      data: {
        doctor: doctorRelation.doctor,
      },
    });
  } catch (error) {
    console.error("Error fetching primary doctor:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching primary doctor",
    });
  }
};

const handleSpecialistApproval = async (req, res) => {
  console.log("=== Starting handleSpecialistApproval ===");
  console.log("Request body:", req.body);
  const { approval_id, action, doctor_id } = req.body;

  try {
    await sequelize.transaction(async (t) => {
      // First, find the specialist approval
      console.log("Looking for approval with ID:", approval_id);
      console.log("Doctor ID:", doctor_id);

      const approval = await SpecialistApproval.findOne({
        where: {
          approval_id: approval_id,
          reffered_doctor_id: doctor_id,
          specialist_status: "PENDING",
        },
        include: [
          {
            model: Appointment,
            required: true,
          },
        ],
        transaction: t,
      });

      console.log("Found approval:", approval);

      if (!approval) {
        throw new Error("Approval request not found or already processed");
      }

      // Update the approval status
      console.log(
        "Updating approval status to:",
        action === "approve" ? "APPROVED" : "REJECTED",
      );
      await approval.update(
        {
          specialist_status: action === "approve" ? "APPROVED" : "REJECTED",
          approved_at: action === "approve" ? new Date() : null,
        },
        { transaction: t },
      );

      // Update the appointment status
      console.log("Updating appointment status");
      await Appointment.update(
        {
          status: action === "approve" ? "CONFIRMED" : "CANCELLED",
        },
        {
          where: {
            appointment_id: approval.appointment_id,
          },
          transaction: t,
        },
      );

      // If approved, create a billing record
      if (action === "approve") {
        console.log("Creating billing record");
        await sequelize.query(
          `INSERT INTO billing (
            patient_id, 
            appointment_id, 
            amount_due,
            amount_paid,
            payment_status,
            billing_due,
            created_at
          ) VALUES (
            :patient_id,
            :appointment_id,
            :amount_due,
            0,
            'NOT PAID',
            DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY),
            NOW()
          )`,
          {
            replacements: {
              patient_id: approval.patient_id,
              appointment_id: approval.appointment_id,
              amount_due: 150.0,
            },
            type: sequelize.QueryTypes.INSERT,
            transaction: t,
          },
        );
      }
    });

    res.json({
      success: true,
      message: `Specialist appointment ${action === "approve" ? "approved" : "rejected"} successfully`,
    });
  } catch (error) {
    console.error("Error in handleSpecialistApproval:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Error processing approval request",
    });
  }
};
const defaultDashboard = {
  populateMYAPPOINTMENTS,
  updateSETTINGS,
  submitNewAppointment,
  requestSpecialistApproval,
  getPrimaryDoctor,
  handleSpecialistApproval,
};
export default defaultDashboard;
