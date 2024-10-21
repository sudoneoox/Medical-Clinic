import Appointment from "../../models/Tables/Appointment.js";

// TODO: handle associations ie tie them with the office, patient, doctor, nurse, etc.
const createAppointment = async (req, res) => {
  try {
    const newAppointment = await Appointment.create(req.body);
    res.status(201).json(newAppointment);
  } catch (error) {
    if (
      error.name == "SequelizeDatabseError" &&
      error.original.sqlState === "45000"
    ) {
      // trigger error
      res
        .status(400)
        .json({ message: "Daily Appointment limit reached for this doctor" });
    } else {
      console.error("Error creating appointment", error);
      res
        .status(500)
        .json({ message: "An error occured while creating the appointment" });
    }
  }
};

export default { createAppointment };
