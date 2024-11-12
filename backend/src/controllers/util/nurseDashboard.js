import Nurse from "../../models/Tables/Nurse.js";
import Doctor from "../../models/Tables/Doctor.js";
import Patient from "../../models/Tables/Patient.js";
import Appointment from "../../models/Tables/Appointment.js";
import Office from "../../models/Tables/Office.js";
import logic from "./shared/logic.js";
import NurseOffices from "../../models/Tables/NurseOffices.js";
import { Op } from "sequelize";

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
        // Optionally filter by status if you don't want to show cancelled appointments
        status: {
          [Op.not]: "CANCELLED",
          [Op.not]: "NO SHOW",
          [Op.not]: "CANCELLED",
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

const nurseDashboard = {
  populateOVERVIEW,
  populateCALENDAR,
  getNurseAppointments,
};

export default nurseDashboard;
