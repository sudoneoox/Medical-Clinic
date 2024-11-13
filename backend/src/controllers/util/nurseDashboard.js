import Nurse from "../../models/Tables/Nurse.js";
import Doctor from "../../models/Tables/Doctor.js";
import Patient from "../../models/Tables/Patient.js";
import Appointment from "../../models/Tables/Appointment.js";
import AppointmentNotes from "../../models/Tables/AppointmentNotes.js";
import Office from "../../models/Tables/Office.js";
import logic from "./shared/logic.js";
import NurseOffices from "../../models/Tables/NurseOffices.js";
import { Op } from "sequelize";
import sequelize from "../../config/database.js";
import Receptionist from "../../models/Tables/Receptionist.js";
import Prescription from "../../models/Tables/Prescription.js";
import MedicalRecord from "../../models/Tables/MedicalRecord.js";
import MedicalRecordNotes from "../../models/Tables/MedicalRecordNotes.js";
import Allergies from "../../models/Tables/Allergies.js";
import { Sequelize } from "sequelize";
import Billing from "../../models/Tables/Billing.js";

const populateOVERVIEW = async (user, nurse, res) => {
  try {
    const nurseWithData = await Nurse.findOne({
      where: { nurse_id: nurse.nurse_id, user_id: user.user_id },
      include: [
        {
          model: Appointment,
          where: { status: "CONFIRMED" },
          required: false,
          include: [
            {
              model: Patient,
              attributes: ["patient_fname", "patient_lname"],
            },
            {
              model: Doctor,
              attributes: ["doctor_fname", "doctor_lname"],
            },
            {
              model: Office,
              attributes: ["office_name"],
            },
          ],
        },
      ],
    });

    return res.json({
      nurseInfo: {
        name: `${nurse.nurse_fname} ${nurse.nurse_lname}`,
        email: user.user_email,
        phone: user.user_phone,
        specialization: nurse.specialization,
      },
      appointments: nurseWithData?.Appointments || [],
    });
  } catch (error) {
    console.error("Error in populateOVERVIEWForNurse:", error);
    res
      .status(500)
      .json({ message: "Error loading nurse dashboard", error: error.message });
  }
};

const populateCALENDAR = async (user, nurse, res) => {
  try {
    // Fetch nurse's assigned appointments
    const appointments = await Appointment.findAll({
      where: {
        attending_nurse: nurse.nurse_id,
        status: ["CONFIRMED", "PENDING"],
        appointment_datetime: {
          [Op.gte]: new Date(),
        },
      },
      include: [
        {
          model: Patient,
          attributes: ["patient_fname", "patient_lname"],
        },
        {
          model: Doctor,
          attributes: ["doctor_fname", "doctor_lname"],
        },
        {
          model: Office,
          attributes: ["office_name", "office_address"],
        },
      ],
      order: [["appointment_datetime", "ASC"]],
    });

    // Fetch nurse's schedule
    const schedules = await NurseOffices.findAll({
      where: {
        nurse_id: nurse.nurse_id,
        effective_start_date: {
          [Op.lte]: new Date(),
        },
        [Op.or]: [
          { effective_end_date: null },
          { effective_end_date: { [Op.gte]: new Date() } },
        ],
      },
      include: [
        {
          model: Office,
          attributes: ["office_name", "office_address"],
        },
      ],
    });

    // Transform appointments for calendar
    const appointmentEvents = appointments.map((apt) => ({
      id: `apt-${apt.appointment_id}`,
      title: `Patient: ${apt.patient.patient_fname} ${apt.patient.patient_lname}`,
      start: apt.appointment_datetime,
      end: new Date(
        new Date(apt.appointment_datetime).getTime() +
          logic.timeToMs(apt.duration),
      ),
      backgroundColor: "#4F46E5", // Indigo for appointments
      extendedProps: {
        type: "appointment",
        location: apt.office.office_name,
        status: apt.status,
        doctor: `Dr. ${apt.doctor.doctor_fname} ${apt.doctor.doctor_lname}`,
        patient: `${apt.patient.patient_fname} ${apt.patient.patient_lname}`,
      },
    }));

    // Transform schedules for calendar using the same helper functions as doctor
    const scheduleEvents = schedules.flatMap((schedule) => {
      const dates = logic.getNextThreeMonthsDates(schedule.day_of_week);

      return dates.map((date) => ({
        id: `schedule-${schedule.nurse_id}-${date}`,
        title: `Work: ${schedule.office.office_name}`,
        start: logic.combineDateTime(date, schedule.shift_start),
        end: logic.combineDateTime(date, schedule.shift_end),
        backgroundColor: schedule.is_primary_office ? "#059669" : "#0891B2",
        extendedProps: {
          type: "schedule",
          location: schedule.office.office_name,
          isPrimary: schedule.is_primary_office,
          scheduleType: schedule.schedule_type,
        },
      }));
    });

    res.json({
      appointments: [...appointmentEvents, ...scheduleEvents],
      nurse: {
        name: `${nurse.nurse_fname} ${nurse.nurse_lname}`,
        specialization: nurse.specialization,
      },
    });
  } catch (error) {
    console.error("Error in populateCALENDAR for nurse:", error);
    res.status(500).json({
      message: "Error loading nurse CALENDAR",
      error: error.message,
    });
  }
};

const getNurseAppointments = async (req, res) => {
  try {
    // First get the nurse ID from the user ID
    const nurse = await Nurse.findOne({
      where: { user_id: req.body.user_id },
    });

    if (!nurse) {
      return res.status(404).json({
        message: "Nurse not found",
        appointments: [],
      });
    }

    // Then get all appointments where this nurse is assigned
    const appointments = await Appointment.findAll({
      where: {
        attending_nurse: nurse.nurse_id,
        status: {
          [Op.not]: ["CANCELLED", "NO SHOW", "COMPLETED", "PENDING"],
        },
      },
      include: [
        {
          model: Patient,
          attributes: ["patient_fname", "patient_lname"],
        },
        {
          model: Office,
          attributes: ["office_name"],
        },
        {
          model: AppointmentNotes,
          required: false, // Left outer join
          include: [
            {
              model: Nurse,
              as: "nurse",
              attributes: ["nurse_fname", "nurse_lname"],
            },
          ],
        },
      ],
      order: [["appointment_datetime", "ASC"]],
    });

    const formattedAppointments = appointments
      ? appointments.map((apt) => ({
          appointment_id: apt.appointment_id,
          appointment_datetime: apt.appointment_datetime,
          duration: apt.duration,
          status: apt.status,
          reason: apt.reason,
          patient_fname: apt.patient?.patient_fname,
          patient_lname: apt.patient?.patient_lname,
          office_name: apt.office?.office_name,
          notes:
            apt.AppointmentNotes?.map((note) => ({
              note_id: note.note_id,
              note_text: note.note_text,
              created_at: note.created_at,
              created_by_nurse: note.created_by_nurse,
              created_by_nurse_name: note.nurse
                ? `${note.nurse.nurse_fname} ${note.nurse.nurse_lname}`
                : "Unknown Nurse",
            })) || [],
        }))
      : [];

    return res.json({
      appointments: formattedAppointments,
    });
  } catch (error) {
    console.error("Error fetching nurse appointments:", error);
    return res.status(500).json({
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};
const getNurseAppointmentsBilling = async (req, res) => {
  try {
    // get nurse ID from the user ID
    const nurse = await Nurse.findOne({
      where: { user_id: req.body.user_id },
    });

    if (!nurse) {
      return res.status(404).json({
        message: "Nurse not found",
        appointments: [],
      });
    }

    // get all appointments where this nurse is assigned
    const appointments = await Appointment.findAll({
      where: {
        attending_nurse: nurse.nurse_id,
        has_bill: 0,
        // Optionally filter by status if you don't want to show cancelled appointments
        status: {
          [Op.eq]: "CONFIRMED",
        },
      },
      include: [
        {
          model: Patient,
          attributes: ["patient_fname", "patient_lname", "patient_id"],
        },
        {
          model: Office,
          attributes: ["office_name"],
        },
      ],
      order: [["appointment_datetime", "ASC"]],
    });

    return res.json({
      appointments: appointments.map((apt) => ({
        appointment_id: apt.appointment_id,
        appointment_datetime: apt.appointment_datetime,
        duration: apt.duration,
        status: apt.status,
        reason: apt.reason,
        patient_fname: apt.patient.patient_fname,
        patient_lname: apt.patient.patient_lname,
        patient_id: apt.patient.patient_id,
        office_name: apt.office.office_name,
      })),
    });
  } catch (error) {
    console.error("Error fetching nurse appointments:", error);
    return res.status(500).json({
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

const createBills = async (req, res) => {
  try {
    const amountDueDate = new Date();
    // Add 14 days (2 weeks) to the current date
    amountDueDate.setDate(amountDueDate.getDate() + 14);
    const nurse = await Nurse.findOne({
      where: { user_id: req.body.userId },
    });

    if (!nurse) {
      return res.status(404).json({
        message: "Nurse not found",
        appointments: [],
      });
    }

    const receptionist = await Receptionist.findOne({
      order: sequelize.random(),
      limit: 1,
    });
    const newBill = await Billing.create({
      appointment_id: req.body.appointment_id,
      patient_id: req.body.patientId,
      payment_status: "NOT PAID",
      amount_due: req.body.billingData.amount_due,
      amount_paid: 0,
      billing_due: amountDueDate,
      handled_by: receptionist.receptionist_id,
    });

    const updateAppointment = await Appointment.findOne({
      where: { appointment_id: req.body.appointment_id },
    });

    if (updateAppointment) {
      await updateAppointment.update({
        has_bill: 1,
      });
    }

    // return res.status(100).json({ message: "Successfully created bills" });
    return res.json({
      message: "Success add bill",
      handled_by: receptionist,
    });
  } catch (error) {
    console.error("Error creating bills:", error);
    return res.status(500).json({
      message: "Error creating bills",
      error: error.message,
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, user_id } = req.body;
    const { appointmentId } = req.params;

    const nurse = await Nurse.findOne({
      where: { user_id },
    });

    if (!nurse) {
      return res.status(404).json({ message: "Nurse not found" });
    }

    const appointment = await Appointment.findOne({
      where: {
        appointment_id: appointmentId,
        attending_nurse: nurse.nurse_id,
      },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.update({ status });
    return res.json({ message: "Appointment status updated successfully" });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return res.status(500).json({
      message: "Error updating appointment status",
      error: error.message,
    });
  }
};

const addAppointmentNote = async (req, res) => {
  try {
    const { note_text, user_id } = req.body;
    const { appointmentId } = req.params;

    const nurse = await Nurse.findOne({
      where: { user_id },
    });

    if (!nurse) {
      return res.status(404).json({ message: "Nurse not found" });
    }

    // Create the new note
    const newNote = await AppointmentNotes.create({
      appointment_id: appointmentId,
      note_text,
      created_by_nurse: nurse.nurse_id,
    });

    // Fetch the created note with nurse information
    const noteWithDetails = await AppointmentNotes.findOne({
      where: { note_id: newNote.note_id },
      include: [
        {
          model: Nurse,
          as: "nurse",
          attributes: ["nurse_fname", "nurse_lname"],
        },
      ],
    });

    // Return the newly created note with all necessary information
    return res.json({
      message: "Note added successfully",
      note: {
        note_id: noteWithDetails.note_id,
        note_text: noteWithDetails.note_text,
        created_at: noteWithDetails.created_at,
        created_by_nurse: noteWithDetails.created_by_nurse,
        created_by_nurse_name: `${noteWithDetails.nurse.nurse_fname} ${noteWithDetails.nurse.nurse_lname}`,
      },
    });
  } catch (error) {
    console.error("Error adding appointment note:", error);
    return res.status(500).json({
      message: "Error adding note",
      error: error.message,
    });
  }
};

const editAppointmentNote = async (req, res) => {
  try {
    const { note_text, user_id } = req.body;
    const { noteId } = req.params;

    const nurse = await Nurse.findOne({
      where: { user_id },
    });

    if (!nurse) {
      return res.status(404).json({ message: "Nurse not found" });
    }

    const note = await AppointmentNotes.findOne({
      where: {
        note_id: noteId,
        created_by_nurse: nurse.nurse_id,
      },
    });

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    await note.update({ note_text });
    return res.json({ message: "Note updated successfully" });
  } catch (error) {
    console.error("Error editing appointment note:", error);
    return res.status(500).json({
      message: "Error editing note",
      error: error.message,
    });
  }
};

const getNursePatientIds = async (userId) => {
  const nurse = await Nurse.findOne({
    where: { user_id: userId },
  });

  if (!nurse) {
    return { error: "Nurse not found", patientIds: [] };
  }

  const appointments = await Appointment.findAll({
    where: {
      attending_nurse: nurse.nurse_id,
      status: {
        [Op.not]: "CANCELLED",
        [Op.not]: "NO SHOW",
      },
    },
    attributes: ["patient_id"],
  });

  if (appointments.length === 0) {
    return { error: "No appointments found for this nurse", patientIds: [] };
  }

  const patientIds = [
    ...new Set(appointments.map((appointment) => appointment.patient_id)),
  ];

  return { nurse, patientIds };
};

const getAllergies = async (req, res) => {
  console.log("ALLERGIES");

  try {
    const { nurse, patientIds, error } = await getNursePatientIds(
      req.body.user_id,
    );

    if (error) {
      return res.status(404).json({ message: error, patientIds });
    }

    const allergies = await Allergies.findAll({
      include: [
        {
          model: MedicalRecord,
          as: "medicalRecord",
          where: { patient_id: { [Op.in]: patientIds } },
          include: [
            {
              model: Patient,
              attributes: ["patient_fname", "patient_lname"],
            },
          ],
        },
      ],
      attributes: [
        "allergy_id",
        "allergy_type",
        "allergen",
        "reaction",
        "severity",
        "onset_date",
      ],
    });

    const patientAllergies = allergies.map((allergy) => {
      const patient = allergy.medicalRecord
        ? allergy.medicalRecord.patient
        : null;
      const patientName = patient
        ? `${patient.patient_fname} ${patient.patient_lname}`
        : "Unknown Patient";

      return {
        patient_name: patientName,
        allergy_id: allergy.allergy_id,
        allergy_type: allergy.allergy_type,
        allergen: allergy.allergen,
        reaction: allergy.reaction,
        severity: allergy.severity,
        onset_date: allergy.onset_date,
      };
    });

    return res.status(200).json({ patientAllergies });
  } catch (error) {
    console.error("Error retrieving allergies:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getPrescriptions = async (req, res) => {
  console.log("PRESCRIPTIONS");

  try {
    const { nurse, patientIds, error } = await getNursePatientIds(
      req.body.user_id,
    );

    if (error) {
      return res.status(404).json({ message: error, patientIds });
    }

    const prescriptions = await Prescription.findAll({
      include: [
        {
          model: MedicalRecord,
          as: "medicalRecord",
          where: { patient_id: { [Op.in]: patientIds } },
          include: [
            {
              model: Patient,
              attributes: ["patient_fname", "patient_lname"],
            },
          ],
        },
      ],
      attributes: [
        "prescription_id",
        "date_issued",
        "medication_name",
        "dosage",
        "frequency",
        "duration",
        "pharmacy_details",
      ],
    });

    const patientMedications = prescriptions.map((prescription) => {
      const patient = prescription.medicalRecord
        ? prescription.medicalRecord.patient
        : null;
      const patientName = patient
        ? `${patient.patient_fname} ${patient.patient_lname}`
        : "Unknown Patient";

      return {
        patient_name: patientName,
        prescription_id: prescription.prescription_id,
        date_issued: prescription.date_issued,
        medication_name: prescription.medication_name,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        duration: prescription.duration,
        pharmacy_details: JSON.stringify(prescription.pharmacy_details),
      };
    });

    return res.status(200).json({ patientMedications });
  } catch (error) {
    console.error("Error retrieving allergies:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMedicalRecords = async (req, res) => {
  console.log("MEDICAL RECORDS");

  try {
    const { nurse, patientIds, error } = await getNursePatientIds(
      req.body.user_id,
    );

    if (error) {
      return res.status(404).json({ message: error, patientIds });
    }

    const medicalRecords = await MedicalRecord.findAll({
      where: { patient_id: { [Op.in]: patientIds }, is_deleted: 0 },
      include: [
        {
          model: Patient,
          attributes: ["patient_fname", "patient_lname"],
        },
        {
          model: Doctor,
          attributes: ["doctor_fname", "doctor_lname"],
        },
        {
          model: MedicalRecordNotes,
          as: "medicalRecordNotes",
          attributes: ["note_id", "description", "created_at", "updated_at"],
        },
      ],
    });

    const patientRecords = medicalRecords.map((medicalData) => {
      console.log(medicalData.medicalRecordNotes);

      return {
        patient_fname: medicalData.patient.patient_fname,
        patient_lname: medicalData.patient.patient_lname,
        doctor_fname: medicalData.doctor.doctor_fname,
        doctor_lname: medicalData.doctor.doctor_lname,
        diagnosis: medicalData.diagnosis,
        record_id: medicalData.record_id,
        created_at: medicalData.created_at,
        updated_at: medicalData.updated_at,
        is_deleted: medicalData.is_deleted,
        appointment_id: medicalData.appointment_id,
        notes: medicalData.medicalRecordNotes,
      };
    });

    return res.status(200).json({ patientRecords });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return res.status(500).json({
      message: "Error fetching medical records",
      error: error.message,
    });
  }
};

const addNote = async (req, res) => {
  console.log(req);
  const { recordId } = req.params;
  const { note_text } = req.body.note_text;
  const userId = req.body.user_id;

  try {
    const nurse = await Nurse.findOne({
      where: { user_id: userId },
    });

    // Insert a new note into the MedicalRecordNotes table
    const newNote = await MedicalRecordNotes.create({
      description: note_text,
      subject: "Medical Record",
      medical_record_id: recordId,
      created_by_user_id: nurse.nurse_id,
    });

    // Send success response with the created note
    return res.status(201).json({
      success: true,
      message: "Note added successfully",
      note: newNote,
    });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add note",
      error: error.message,
    });
  }
};

const editNote = async (req, res) => {
  const { noteId } = req.params;
  const { note_text, user_id } = req.body;

  try {
    // Find the note by ID
    const note = await MedicalRecordNotes.findOne({
      where: {
        note_id: noteId,
        is_deleted: 0,
      },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update the note
    note.note_text = note_text;
    note.updated_at = new Date();
    note.updated_by_nurse = user_id;

    await note.save();

    return res.status(200).json({
      message: "Note updated successfully",
      updatedNote: note,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({
      message: "Error updating note",
      error: error.message,
    });
  }
};

const nurseDashboard = {
  populateOVERVIEW,
  populateCALENDAR,
  getNurseAppointments,
  getNurseAppointmentsBilling,
  createBills,
  updateAppointmentStatus,
  addAppointmentNote,
  editAppointmentNote,
  getAllergies,
  getPrescriptions,
  getMedicalRecords,
  addNote,
  editNote,
};

export default nurseDashboard;
