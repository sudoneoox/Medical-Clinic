CREATE TYPE IF NOT EXISTS phone_num AS (
    country_code VARCHAR(5),
    area_code VARCHAR(5),
    number VARCHAR(15)
);

CREATE TYPE IF NOT EXISTS user_role AS ENUM ('admin', 'doctor', 'patient');

CREATE TYPE IF NOT EXISTS name (
    first_name VARCHAR(50),
    middle_name VARCHAR(50),
    last_name VARCHAR(50)
);

CREATE TYPE IF NOT EXISTS address (
    other INTEGER,
    street VARCHAR(50),
    city VARCHAR(40),
    state VARCHAR(25),
    zip VARCHAR(10),
    country VARCHAR(40)
);

CREATE TYPE IF NOT EXISTS office (
    office_id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    address address,
    phone phone_num,
    email VARCHAR(100),
    office_hours VARCHAR(50) [],
    services VARCHAR(50) []
);

CREATE TYPE IF NOT EXISTS doctor_for_patient (
    doctor_id INTEGER,
    specialty VARCHAR(50),
    license_number VARCHAR(50)
);

CREATE TYPE IF NOT EXISTS emergency_contact (
    name name,
    phone phone_num,
    email VARCHAR(100),
);

CREATE TYPE IF NOT EXISTS insurance (
    name VARCHAR(50),
    serial_number VARCHAR(50),
    phone phone_num,
    email VARCHAR(100),
);

CREATE TYPE IF NOT EXISTS appointment_status AS ENUM ('confirmed', 'cancelled', 'completed', 'no_show');