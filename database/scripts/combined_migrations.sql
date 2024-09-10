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

CREATE TYPE specialist_request_status as ENUM ('PENDING', 'APPROVED', 'REJECTED');-- base table for authentication and logging in 
-- long passwd in case we want to hash? 
-- phone number is a composite type for analysis with area codes and country codes
-- created_at and last_login are timestamps for when the user was created and last logged in
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE NOT NULL,
    passwd VARCHAR(255) NOT NULL, 
    email VARCHAR(100) UNIQUE NOT NULL,
    phone phone_num UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE);
-- Doctor table, extends user
CREATE TABLE IF NOT EXISTS doctor (
    doctor_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER UNIQUE NOT NULL,
    doctor_name name,
    license_number VARCHAR(50) NOT NULL,
    specialties VARCHAR(50) [],
    years_of_experience INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id));-- holds a ptr to the user_id to distinguish between patients and doctors
-- we could maybe do a boolcase ? ie ids larger than 1000 are doctors ? 

-- patient table, extends user
CREATE TABLE IF NOT EXISTS patient (
    patient_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER UNIQUE NOT NULL,
    patient_name name NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(30),
    ethnicities VARCHAR(50) [],
    address address,
    emergency_contacts emergency_contact [],
    primary_doctor_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (primary_doctor_id) REFERENCES doctor(doctor_id));-- specialist approval requests
CREATE TABLE IF NOT EXISTS specialist_approvals (
    approval_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, -- unique id for each approval
    patient_id INTEGER NOT NULL,
    requesting_doctor_id INTEGER NOT NULL,
    specialist_id INTEGER NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    status specialist_request_status NOT NULL, -- PENDING, APPROVED, REJECTED
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (requesting_doctor_id) REFERENCES doctor(doctor_id),
    FOREIGN KEY (specialist_id) REFERENCES doctor(doctor_id)
);-- prescription information linked to a medical record
CREATE TABLE IF NOT EXISTS prescription (
    prescription_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    record_id INTEGER NOT NULL,
    medication_info medication NOT NULL,
    date_issued TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    pharmacy_details JSONB,
    FOREIGN KEY (record_id) REFERENCES medical_records(record_id)
);-- Billing table to keep track of payments for appointments
CREATE TABLE IF NOT EXISTS billing (
    billing_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER NOT NULL,
    amount_due DECIMAL NOT NULL,
    amount_paid DECIMAL NOT NULL DEFAULT 0,
    payment_status billing_status NOT NULL, -- PAID, NOT PAID, IN PROGRESS, CANCELLED, REFUNDED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    CHECK (amount_due >= 0),
    CHECK (amount_paid >= 0)
);
-- office locations
CREATE TABLE IF NOT EXISTS office  (
    office_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    address address NOT NULL,
    phone phone_num,
    email TEXT,
    services VARCHAR(50) []
);

-- Doctor-Office Relationship (many to many)
CREATE TABLE IF NOT EXISTS doctor_offices (
    doctor_id INTEGER,
    office_id INTEGER,
    PRIMARY KEY (doctor_id, office_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
    FOREIGN KEY (office_id) REFERENCES office(office_id)
);-- appointments linking patients, doctors, and offices
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    appointment_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTERVAL NOT NULL,
    reason TEXT NOT NULL,
    status appointment_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
    FOREIGN KEY (office_id) REFERENCES office(office_id),
    CHECK (appointment_datetime > created_at)
);
-- patient insurance information linked with patient id to identify
CREATE TABLE IF NOT EXISTS insurances (
    insurance_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    insurance_info insurance NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);-- audit log to track changes in system
CREATE TABLE IF NOT EXISTS AUDIT_LOG(
   log_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   table_name VARCHAR(50) NOT NULL,
   record_id INTEGER NOT NULL,
   action VARCHAR(10) NOT NULL,
   changed_by INTEGER NOT NULL,
   changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   old_values JSONB,
   new_values JSONB,
   FOREIGN KEY (changed_by) REFERENCES users(user_id)
);

-- need to implement trigger function to log changes to the audit log table
-- CREATE OR REPLACE FUNCTION audit_log_trigger() RETURNS TRIGGER AS $$

-- medical records linking patients, doctors, and appointments (not required)
CREATE TABLE IF NOT EXISTS medical_records (
    record_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- dateissued
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- incase any updates on diagnosis or changes 
    diagnosis TEXT NOT NULL,
    notes TEXT,
    test_results JSONB,

    -- ptr to the patient and doctor
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
);