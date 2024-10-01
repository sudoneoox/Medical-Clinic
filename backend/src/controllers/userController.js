import User from "../models/Tables/Users.js";

// TODO  also have to add a (doctor, patient, nurse, or receptionist) depending on the user role
// TODO given on the form, and parse out the req for specific data in each?
// TODO also have to parse out the demographic data and associate it to the respecitive codes etc.
// TODO have to link the user with the role they chose with their foreign keys

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    console.log(req.body);
    return;
    const newUser = await User.create(userData);
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.userId,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else if (error.code === 11000) {
      // Duplicate key error
      res.status(409).json({ message: "User already exists" });
    } else {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  }
};
export default registerUser;
