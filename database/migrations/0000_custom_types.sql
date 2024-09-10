-- composite type phone number for analysis
CREATE TYPE phone_num AS (
    country_code VARCHAR(5),
    area_code VARCHAR(5),
    number VARCHAR(15)
);

CREATE TYPE name AS(
    first_name VARCHAR(50),
    middle_name VARCHAR(50),
    last_name VARCHAR(50)
);

CREATE TYPE address AS (
    -- extra refers to house #, apt #, etc.
    extra INTEGER,
    street VARCHAR(50),
    city VARCHAR(40),
    state VARCHAR(25),
    zip VARCHAR(10),
    country VARCHAR(40)
);

CREATE TYPE emergency_contact AS (
    contact_name name,
    phone phone_num,
    email TEXT
);

CREATE TYPE insurance AS (
    insurance_name VARCHAR(50),
    serial_number VARCHAR(50),
    phone phone_num,
    email TEXT
);

CREATE TYPE medication AS (
    medication_name VARCHAR(50),
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration INTERVAL
);

CREATE TYPE appointment_status AS ENUM (
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED',
    'NO SHOW'
);

CREATE TYPE billing_status AS ENUM (
    'PAID',
    'NOT PAID',
    'IN PROGRESS',
    'CANCELLED',
    'REFUNDED'
);

CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'patient');

CREATE TYPE specialist_request_status as ENUM ('PENDING', 'APPROVED', 'REJECTED');