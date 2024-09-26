-- composite type phone number for analysis

CREATE TYPE address AS (
    -- extra refers to house #, apt #, etc.
    extra VARCHAR(20),
    street VARCHAR(30),
    city VARCHAR(20),
    state VARCHAR(15),
    zip smallint,
    country VARCHAR(20)
);

CREATE TYPE emergency_contact AS (
    contact_name VARCHAR(50),
    phone VARCHAR(20),
    email TEXT
);

CREATE TYPE insurance AS (
    insurance_name VARCHAR(25),
    serial_number VARCHAR(30),
    phone VARCHAR(20),
    email TEXT
);

CREATE TYPE medication AS (
    medication_name VARCHAR(50),
    dosage VARCHAR(20),
    frequency VARCHAR(20),
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

CREATE TYPE user_role AS ENUM ('ADMIN', 'DOCTOR', 'PATIENT', 'NURSE', 'RECEPTIONIST');

CREATE TYPE specialist_request_status as ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TYPE notification_type as ENUM (
    'APPOINTMENT REMINDER',
    'TEST_RESULT_AVAILABLE',
    'PRESCRIPTION READY',
    'BILLING REMINDER',
    'GENERAL'
);