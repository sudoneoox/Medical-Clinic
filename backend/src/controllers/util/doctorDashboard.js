import Appointment from "../../models/Tables/Appointment.js";
import Doctor from "../../models/Tables/Doctor.js";
import Office from "../../models/Tables/Office.js";
import MedicalRecord from "../../models/Tables/MedicalRecord.js";
import Patient from "../../models/Tables/Patient.js";
import DoctorOffices from "../../models/Tables/DoctorOffices.js";
import { Op } from "@sequelize/core";
import logic from "./shared/logic.js";

// handle backend logic for todays and upcoming appointments in the backend
const populateOVERVIEW = async (user, doctor, res) => {
  try {
    // Get current date
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    // Find related appointments
    const doctorData = await Doctor.findOne({
      where: { doctor_id: doctor.doctor_id },
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
              model: Office,
              attributes: ["office_name"],
            },
          ],
        },
      ],
    });

    // Get today's appointments
    const todaysAppointments = await Appointment.findAll({
      where: {
        doctor_id: doctor.doctor_id,
        status: "CONFIRMED",
        appointment_datetime: {
          [Op.between]: [startOfToday, endOfToday],
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

    // Get upcoming appointments (next 5 after today)
    const upcomingAppointments = await Appointment.findAll({
      where: {
        doctor_id: doctor.doctor_id,
        status: "CONFIRMED",
        appointment_datetime: {
          [Op.gt]: endOfToday,
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
      limit: 5,
    });

    return res.json({
      doctorInfo: {
        name: `${doctor.doctor_fname} ${doctor.doctor_lname}`,
        email: user.user_email,
        phone: user.user_phone,
        experience: doctor.years_of_experience,
      },
      allAppointments: doctorData?.appointments || [],
      todaysAppointments: todaysAppointments || [],
      upcomingAppointments: upcomingAppointments || [],
    });
  } catch (error) {
    console.error("Error in populateOVERVIEWForDoctor:", error);
    res.status(500).json({
      message: "Error loading doctor dashboard",
      error: error.message,
    });
  }
};

const populateCALENDAR = async (user, doctor, res) => {
  try {
    // Fetch appointments
    const appointments = await Appointment.findAll({
      where: {
        doctor_id: doctor.doctor_id,
        status: ["CONFIRMED", "PENDING"],
        appointment_datetime: {
          [Op.gte]: new Date(), // Only future appointments
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

    // Fetch doctor's schedule
    const schedules = await DoctorOffices.findAll({
      where: {
        doctor_id: doctor.doctor_id,
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
        duration: apt.duration,
        patient: `${apt.patient.patient_fname} ${apt.patient.patient_lname}`,
      },
    }));

    // Transform schedules for calendar
    const scheduleEvents = schedules.flatMap((schedule) => {
      // Get dates for the next 3 months
      const dates = logic.getNextThreeMonthsDates(schedule.day_of_week);

      return dates.map((date) => ({
        id: `schedule-${schedule.doctor_id}-${date}`,
        title: `Work: ${schedule.office.office_name}`,
        start: logic.combineDateTime(date, schedule.shift_start),
        end: logic.combineDateTime(date, schedule.shift_end),
        backgroundColor: schedule.is_primary_office ? "#059669" : "#0891B2", // Green for primary, Cyan for others
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
      doctor: {
        name: `Dr. ${doctor.doctor_fname} ${doctor.doctor_lname}`,
        specialties: await doctor.getSpecialties(),
      },
    });
  } catch (error) {
    console.error("Error in populateCALENDAR for doctor:", error);
    res.status(500).json({
      message: "Error loading doctor CALENDAR",
      error: error.message,
    });
  }
};

const populateMYAPPOINTMENTS = async (user, doctor, res) => {
  try {
    return res.json({
      message: "NOT YET IMPLEMENTED",
    });
  } catch (error) {
    console.error("Error in populateMYAPPOINTMENTS for doctor:", error);
    res.status(500).json({
      message: "Error loading doctor MYAPPOINTMENTS",
      error: error.message,
    });
  }
};

const populatePATIENTS = async (user, doctor, res) => {
  console.log("Running Patient list for docs");
  try {
    const patients = await Doctor.findOne({
      where: { doctor_id: doctor.doctor_id },
      include: [
        {
          model: Patient,
          attributes: ["patient_id", "patient_fname", "patient_lname"],
          include: [
            {
              model: MedicalRecord,
              attributes: [
                "record_id",
                "diagnosis",
                "updated_at",
                "appointment_id",
              ], // Adjust the attributes as needed
            },
          ],
        },
      ],
    });

    return res.json({
      doctorInfo: {
        name: `${doctor.doctor_fname} ${doctor.doctor_lname}`,
        email: user.user_email,
        phone: user.user_phone,
        experience: doctor.years_of_experience,
      },
      // appointments: appointments?.appointments || [],
      patients: patients?.patients || [],
    });
  } catch (error) {
    console.error("Error in populateOVERVIEWForDoctor:", error);
    res.status(500).json({
      message: "Error loading doctor dashboard",
      error: error.message,
    });
  }
};

const doctorDashboard = {
  populateOVERVIEW,
  populateCALENDAR,
  populateMYAPPOINTMENTS,
  populatePATIENTS,
};

export default doctorDashboard;
