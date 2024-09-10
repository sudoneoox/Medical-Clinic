const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

// ! PHONE NUM
sequelize.queryInterface.sequelize
  .query(
    `
    CREATE TYPE phone_num AS (
        country_code VARCHAR(5),
        area_code VARCHAR(5),
        phone_number VARCHAR(15)
    );
`
  )
  .then(() =>
    console
      .log("phone_num type created")
      .catch((error) => console.error("error creating phone_num type", error))
  );

// ! NAME
sequelize.queryInterface.sequelize
  .query(
    `
CREATE TYPE name AS(
    first_name VARCHAR(50),
    middle_name VARCHAR(50),
    last_name VARCHAR(50)
);
  `
  )
  .then(() =>
    console
      .log("name type created")
      .catch((error) => console.error("error creating name type", error))
  );

// ! ADDRESS
sequelize.queryInterface.sequelize
  .query(
    `
CREATE TYPE address AS (
    -- extra refers to house #, apt #, etc.
    extra INTEGER,
    street VARCHAR(50),
    city VARCHAR(40),
    state VARCHAR(25),
    zip VARCHAR(10),
    country VARCHAR(40)
);

  `
  )
  .then(() =>
    console
      .log("address type created")
      .catch((error) => console.error("error creating address type", error))
  );

// ! emergency_contact
sequelize.queryInterface.sequelize
  .query(
    `
CREATE TYPE emergency_contact AS (
    contact_name name,
    phone phone_num,
    email TEXT
);
  `
  )
  .then(() =>
    console
      .log("emergency_contact type created")
      .catch((error) =>
        console.error("error creating emergency_contact type", error)
      )
  );

// ! insurance
sequelize.queryInterface.sequelize
  .query(
    `

    CREATE TYPE insurance AS (
        insurance_name VARCHAR(50),
        serial_number VARCHAR(50),
        phone phone_num,
        email TEXT
    );
  `
  )
  .then(() =>
    console
      .log("insurance type created")
      .catch((error) => console.error("error creating insurance type", error))
  );

//!medication
sequelize.queryInterface.sequelize
  .query(
    `

CREATE TYPE medication AS (
    medication_name VARCHAR(50),
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration INTERVAL
);
  `
  )
  .then(() =>
    console
      .log("medication type created")
      .catch((error) => console.error("error creating medication type", error))
  );
// ! appointment status
sequelize.queryInterface
  .createType("appointment_status", [
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
    "NO SHOW",
  ])
  .then(() => console.log("appointment_status type created"))
  .catch((error) =>
    console.error("Error creating appointment_status type:", error)
  );
// ! billing status
sequelize.queryInterface
  .createType("billing_status", [
    "PAID",
    "NOT PAID",
    "IN PROGRESS",
    "CANCELLED",
    "REFUNDED",
  ])
  .then(() => console.log("billing_status type created"))
  .catch((error) =>
    console.error("Error creating billing_status type:", error)
  );
// ! user role
sequelize.queryInterface
  .createType("user_role", ["admin", "doctor", "patient"])
  .then(() => console.log("user_role type created"))
  .catch((error) => console.error("Error creating user_role type:", error));

// ! specialist request status
sequelize.queryInterface
  .createType("specialist_request_status", ["PENDING", "APPROVED", "REJECTED"])
  .then(() => console.log("specialist_request_status type created"))
  .catch((error) =>
    console.error("Error creating specialist_request_status type:", error)
  );
