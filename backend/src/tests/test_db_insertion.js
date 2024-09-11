const sequelize = require("../config/database");
const { User, Office, Appointment } = require("../models/tableExports");

async function testDBInsertion_Retrieval() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Test User creation
    const user = await User.create({
      name: {
        first_name: "John",
        middle_name: "Doe",
        last_name: "Smith",
      },
      phone_num: {
        country_code: "1",
        area_code: "555",
        phone_number: "12345617",
      },
      email: "john.sdddddfddd11mith@example.com",
      role: "patient",
      username: "JOHNddDdfdddOddESMITH1",
      user_role: "doctor",
      passwd: "abc123",
    });
    console.log("User created:", user.toJSON());

    // // Test User retrieval
    // const retrievedUser = await User.findByPk(user.id);
    // console.log("Retrieved user:", retrievedUser.toJSON());

    // Test Office creation
    const office = await Office.create({
      name: "Main Office",
      address: {
        extra: 123,
        street: "Main St",
        city: "Anytown",
        state: "ST",
        zip: "12345",
        country: "USA",
      },
      phone: {
        country_code: "1",
        area_code: "555",
        phone_number: "9876543",
      },
    });

    console.log("Office created:", office.toJSON());

    // Test Appointment creation
    const appointment = await Appointment.create({
      date: new Date(),
      status: "CONFIRMED",
      UserId: user.id,
      OfficeId: office.id,
    });
    console.log("Appointment created:", appointment.toJSON());

    // Test association
    const userWithAppointments = await User.findByPk(user.id, {
      include: [Appointment],
    });
    console.log("User with appointments:", userWithAppointments.toJSON());
  } catch (error) {
    console.error("Unable to perform database operations:", error);
  } finally {
    await sequelize.close();
  }
}

testDBInsertion_Retrieval();
