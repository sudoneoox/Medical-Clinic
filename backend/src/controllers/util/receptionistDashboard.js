import Appointment from "../../models/Tables/Appointment.js";
import Patient from "../../models/Tables/Patient.js";
import Doctor from "../../models/Tables/Doctor.js";
import Office from "../../models/Tables/Office.js";
import Receptionist from "../../models/Tables/Receptionist.js";
import logic from "./shared/logic.js";
import ReceptionistOffices from "../../models/Tables/ReceptionistOffices.js";
import { Op } from "sequelize";
import User from "../../models/Tables/Users.js";
const populateOVERVIEW = async (user, receptionist, res) => {
  try {
    const receptionistWithData = await Receptionist.findOne({
      where: { receptionist_id: receptionist.receptionist_id },
      include: [
        {
          model: Appointment,
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
        {
          model: User,
          where: { is_deleted: 0},
        },
      ],
    });

    return res.json({
      receptionistInfo: {
        name: `${receptionist.receptionist_fname} ${receptionist.receptionist_lname}`,
        email: user.user_email,
        phone: user.user_phone,
      },
      appointments: receptionistWithData?.Appointments || [],
    });
  } catch (error) {
    console.error("Error in populateOVERVIEWForReceptionist:", error);
    res.status(500).json({
      message: "Error loading receptionist dashboard",
      error: error.message,
    });
  }
};

const populateAPPOINTMENTS = async (user, receptionist, res) => {
  console.log("INSIDE receptionist populateAPPOINTMENTS");
};

const populateCALENDAR = async (user, receptionist, res) => {
  try {
    // Fetch appointments booked by this receptionist
    const appointments = await Appointment.findAll({
      where: {
        booked_by: receptionist.receptionist_id,
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

    // Fetch receptionist's schedule
    const schedules = await ReceptionistOffices.findAll({
      where: {
        receptionist_id: receptionist.receptionist_id,
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
      title: `Appointment`,
      start: apt.appointment_datetime,
      end: new Date(
        new Date(apt.appointment_datetime).getTime() +
          logic.timeToMs(apt.duration),
      ),
      backgroundColor: "#4F46E5",
      extendedProps: {
        type: "appointment",
        location: apt.office.office_name,
        status: apt.status,
        doctor: `Dr. ${apt.doctor.doctor_fname} ${apt.doctor.doctor_lname}`,
        patient: `${apt.patient.patient_fname} ${apt.patient.patient_lname}`,
      },
    }));

    // Transform schedules for calendar using the same helper functions
    const scheduleEvents = schedules.flatMap((schedule) => {
      const dates = logic.getNextThreeMonthsDates(schedule.day_of_week);

      return dates.map((date) => ({
        id: `schedule-${schedule.receptionist_id}-${date}`,
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
      receptionist: {
        name: `${receptionist.receptionist_fname} ${receptionist.receptionist_lname}`,
      },
    });
  } catch (error) {
    console.error("Error in populateCALENDAR for receptionist:", error);
    res.status(500).json({
      message: "Error loading receptionist CALENDAR",
      error: error.message,
    });
  }
};

const populatePATIENTRECORDS = async (user, receptionist, res) => {
  try {
    console.log("INSIDE receptionist populatePATIENTRECORDS");

    const receptionistData = await Receptionist.findOne({
      where: { 
        receptionist_id: receptionist.receptionist_id,
      },
      include: [
        {
          model: Office,
          attributes: ["office_id"],
          required: true,
        },
        {
          model: User,
          where: {is_deleted: 0 },
        },
      ],
    });
    const officeIds =
      receptionistData?.offices?.map((office) => office.office_id) || []; // Get the office ID

    const doctors = await Doctor.findAll({
      include: [
        {
          model: Office,
          where: { office_id: officeIds[0] },
        },
        {
          model: Patient,
          attributes: ["patient_fname", "patient_lname", "patient_id"],
          required: true,
        },
        {
          model: User,
          where: { is_deleted: 0 },
        }
      ],
    });

    const patients = doctors.flatMap((doctor) => doctor.patients || []);

    return res.json({
      patients,
    });
  } catch (error) {
    console.error("Error in populatePatientsForClinic:", error);
    res.status(500).json({
      message: "Error loading patients for the clinic",
      error: error.message,
    });
  }
};

const retrieveAppointmentsList = async (req, res) => {
  console.log("RECEPTIONIST", req.body);
  try {
    const user_id = req.body.user_id;
    const receptionist_id = await Receptionist.findOne({
      where: { user_id: user_id },
      include: [
        {
          model: User,
          where: { is_deleted: 0 },
        }
      ],
    });
    console.log(receptionist_id);
    const appointmentsRecords = await Appointment.findAll({
      where: {
        booked_by: receptionist_id.receptionist_id,
        status: "CONFIRMED",
      },

      include: [
        {
          model: Patient,
          attributes: ["patient_fname", "patient_lname", "patient_id"],
        },
      ],
    });
    console.log(appointmentsRecords);

    return res.json(appointmentsRecords);
  } catch (error) {
    console.error("Error fetching appointment data", error);
    return res.status(500).json({
      message: "Error fetching appointment data",
      error: error.message,
    });
  }
};

const retrieveAppointmentsForPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: { patient_id: req.body.patient_id },
    });
    const receptionist_id = await Receptionist.findOne({
      where: {
        user_id: req.body.user_id,
      },
      include: [
        {
          model: User,
          where: { is_deleted: 0 },
        }
      ],
    });

    const appointmentsRecords = await Appointment.findAll({
      where: {
        booked_by: receptionist_id.receptionist_id,
        patient_id: patient.patient_id,
      },

      include: [
        {
          model: Patient,
          attributes: ["patient_fname", "patient_lname", "patient_id"],
        },
        {
          model: Doctor,
          attributes: ["doctor_fname", "doctor_lname"],
        },
      ],
    });
    console.log(appointmentsRecords.doctor);

    return res.json(appointmentsRecords);
  } catch (error) {
    console.error("Error fetching appointment data", error);
    return res.status(500).json({
      message: "Error fetching appointment data",
      error: error.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  const { appointment_id, user_id } = req.body;

  // Check if the required fields are provided
  if (!appointment_id || !user_id) {
    return res
      .status(400)
      .json({ error: "Appointment ID and User ID are required" });
  }

  try {
    // Fetch the appointment from the database
    const appointment = await Appointment.findOne({
      where: {
        appointment_id: appointment_id,
        status: {
          [Op.not]: ["CANCELLED", "COMPLETED"], // Make sure the appointment is not already canceled or completed
        },
      },
    });
    console.log(appointment);
    if (!appointment) {
      return res
        .status(404)
        .json({ error: "Appointment not found or cannot be canceled" });
    }

    // Update the appointment status to 'CANCELED'
    appointment.status = "CANCELLED";
    await appointment.save();

    // Return success message
    return res
      .status(200)
      .json({ message: "Appointment successfully canceled" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while canceling the appointment" });
  }
};

const getPatients = async (req,res) => {
  try {
    const patients = await Patient.findAll({
      attributes: ["patient_id","patient_fname","patient_lname"],
    });
    return res.json(patients)
  } catch (error) {
    
  }
}

const receptionistDashboard = {
  populateOVERVIEW,
  populateAPPOINTMENTS,
  populatePATIENTRECORDS,
  populateCALENDAR,
  retrieveAppointmentsForPatient,
  retrieveAppointmentsList,
  cancelAppointment,
  getPatients,
};

export default receptionistDashboard;
