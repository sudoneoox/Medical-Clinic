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
);-- base table for authentication and logging in 
-- long passwd in case we want to hash? 
-- phone number is a composite type for analysis with area codes and country codes
-- created_at and last_login are timestamps for when the user was created and last logged in
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE NOT NULL,
    passwd VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at DATE DEFAULT CURRENT_TIMESTAMP,
    last_login DATE DEFAULT CURRENT_TIMESTAMP,
    role user_role NOT NULL,
    CONSTRAINT chk_email CHECK (email LIKE '%@%')
);
-- Doctor table, extends user
CREATE TABLE IF NOT EXISTS doctor (
    doctor_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER UNIQUE NOT NULL,
    doctor_name VARCHAR(50) NOT NULL,
    license_number VARCHAR(30) NOT NULL,
    specialties VARCHAR(30) [],
    years_of_experience INTEGER,
    CONSTRAINT fk_doctor_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id) -- on delete delete the referenced row as well
        ON DELETE CASCADE,
    CHECK (years_of_experience > 0 AND years_of_experience < 90)
);-- holds a ptr to the user_id to distinguish between patients and doctors
-- we could maybe do a boolcase ? ie ids larger than 1000 are doctors ? 
-- patient table, extends user
CREATE TABLE IF NOT EXISTS patient (
    patient_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER UNIQUE NOT NULL,
    patient_name VARCHAR(50) NOT NULL,
    emergency_contacts emergency_contact [],
    primary_doctor_id INTEGER,
    specialized_doctors_id INTEGER [],
    CONSTRAINT fk_patient_user
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_patient_doctor
        FOREIGN KEY (primary_doctor_id) 
        REFERENCES doctor(doctor_id)
        ON DELETE SET NULL
);CREATE TABLE IF NOT EXISTS patient_doctor (
    patient_id INTEGER,
    doctor_id INTEGER,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (patient_id, doctor_id),
    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE,
    CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX unique_primary_doctor ON patient_doctor (patient_id) WHERE is_primary = TRUE;
-- specialist approval requests
CREATE TABLE IF NOT EXISTS specialist_approvals (
    approval_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, -- unique id for each approval
    patient_id INTEGER NOT NULL,
    requesting_doctor_id INTEGER NOT NULL, -- the primary doctor of the patient or the doctor requesting the specialist
    specialist_id INTEGER NOT NULL,

    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    status specialist_request_status NOT NULL, -- PENDING, APPROVED, REJECTED

    CONSTRAINT fk_approval_patient
        FOREIGN KEY (patient_id) 
        REFERENCES patient(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_approval_requesting_doctor
        FOREIGN KEY (requesting_doctor_id) 
        REFERENCES doctor(doctor_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_approval_specialist
        FOREIGN KEY (specialist_id) 
        REFERENCES doctor(doctor_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_specialist_request
        UNIQUE ( patient_id, requesting_doctor_id, specialist_id ),
    
    CHECK ( status IN ('PENDING', 'APPROVED', 'REJECTED') )
);-- office locations
CREATE TABLE IF NOT EXISTS office  (
    office_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    office_name VARCHAR(50) NOT NULL,
    office_address address NOT NULL,
    phone VARCHAR(20),
    email TEXT,
    services VARCHAR(50) [],

    CONSTRAINT chk_email CHECK (email IS NULL OR email LIKE '%@%')
);

-- Doctor-Office Relationship (many to many)
CREATE TABLE IF NOT EXISTS doctor_offices (
    doctor_id INTEGER,
    office_id INTEGER,
    PRIMARY KEY (doctor_id, office_id),

    CONSTRAINT fk_doctor_office_doctor
        FOREIGN KEY (doctor_id) 
        REFERENCES doctor(doctor_id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_doctor_office_office
        FOREIGN KEY (office_id)
        REFERENCES office(office_id)
        ON DELETE CASCADE
);-- appointments linking patients, doctors, and offices
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    appointment_datetime DATE NOT NULL,
    duration INTERVAL NOT NULL,
    reason TEXT,
    status appointment_status NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE NOT NULL,
    updated_at DATE DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE,
    CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    CONSTRAINT fk_appointment_office FOREIGN KEY (office_id) REFERENCES office(office_id) ON DELETE CASCADE,
    CONSTRAINT check_appointment_datetime CHECK (appointment_datetime > created_at),
    CHECK(status IN ('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO SHOW'))
);-- Billing table to keep track of payments for appointments
CREATE TABLE IF NOT EXISTS billing (
    billing_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER NOT NULL,
    amount_due DECIMAL NOT NULL,
    amount_paid DECIMAL NOT NULL DEFAULT 0,
    -- PAID, NOT PAID, IN PROGRESS, CANCELLED, REFUNDED
    payment_status billing_status NOT NULL,
    billing_due DATE NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE NOT NULL,
    updated_at DATE DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT fk_billing_patient FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE,
    CONSTRAINT fk_billing_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    CONSTRAINT check_amount_due CHECK (amount_due >= 0),
    CONSTRAINT check_amount_paid CHECK (amount_paid >= 0),
    CHECK (
        payment_status IN (
            'PAID',
            'NOT PAID',
            'IN PROGRESS',
            'CANCELLED',
            'REFUNDED'
        )
    )
);-- patient insurance information linked with patient id to identify
CREATE TABLE IF NOT EXISTS insurances (
    insurance_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    insurance_info insurance NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_insurance_patient
        FOREIGN KEY (patient_id) 
        REFERENCES patient(patient_id)
        ON DELETE CASCADE
);-- medical records linking patients, doctors, and appointments (not required)
CREATE TABLE IF NOT EXISTS medical_records (
    record_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER,
    created_at DATE DEFAULT CURRENT_DATE NOT NULL,
    -- dateissued
    updated_at DATE DEFAULT CURRENT_DATE NOT NULL,
    -- incase any updates on diagnosis or changes 
    diagnosis VARCHAR(100),
    notes TEXT,
    test_results JSONB,
    -- ptr to the patient and doctor
    CONSTRAINT fk_medical_record_patient FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE,
    CONSTRAINT fk_medical_record_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    CONSTRAINT fk_medical_record_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL
);-- prescription information linked to a medical record
CREATE TABLE IF NOT EXISTS prescription (
    prescription_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    record_id INTEGER NOT NULL,
    medication_info medication NOT NULL,
    date_issued TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    pharmacy_details JSONB,

    CONSTRAINT fk_prescription_medical_record
        FOREIGN KEY (record_id) 
        REFERENCES medical_records(record_id)
        ON DELETE CASCADE
);-- audit log to track changes in system
CREATE TABLE IF NOT EXISTS AUDIT_LOG(
   log_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   table_name VARCHAR(30) NOT NULL,
   record_id INTEGER NOT NULL,
   audit_action VARCHAR(10) NOT NULL,
   changed_by INTEGER NOT NULL,
   changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   old_values JSONB,
   new_values JSONB,

   CONSTRAINT fk_audit_log_user
      FOREIGN KEY (changed_by) 
      REFERENCES users(user_id)
      ON DELETE SET NULL
);

-- need to implement trigger function to log changes to the audit log table
-- CREATE OR REPLACE FUNCTION audit_log_trigger() RETURNS TRIGGER AS $$

-- notifications for UI
CREATE TABLE notifications (
    notification_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    type_notif notification_type NOT NULL,
    message TEXT NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE NOT NULL,
    read_at DATE,
    is_read BOOLEAN DEFAULT FALSE,
    -- appointment, medical_record, ie what entity is related to this notification
    related_entitiy_type VARCHAR(30),
    related_entity_id INTEGER,
    CONSTRAINT fk_notification_sender FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_receiver FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT chk_notif CHECK (type_notif IN ('APPOINTMENT REMINDER', 'TEST_RESULT_AVAILABLE', 'PRESCRIPTION READY', 'BILLING REMINDER', 'GENERAL NOTIFICATION'))
);

CREATE TABLE IF NOT EXISTS race_code (
    race_code smallint PRIMARY KEY,
    race_text VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS gender_code (
    gender_code smallint PRIMARY KEY,
    gender_text VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS ethnicity_code (
    ethnicity_code smallint PRIMARY KEY,
    ethnicity_text VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS demographics (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ethnicity smallint,
    race smallint,
    gender smallint,
    dob DATE,
    created_by INT,
    created_at DATE,
    updated_by INTEGER,
    updated_at DATE,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL,
    CONSTRAINT fk_race_code FOREIGN KEY (race) REFERENCES race_code(race_code) ON DELETE SET NULL, 
    CONSTRAINT fk_gender_code FOREIGN KEY (gender) REFERENCES gender_code(gender_code) ON DELETE SET NULL,
    CONSTRAINT fk_ethnicity_code FOREIGN KEY (ethnicity) REFERENCES ethnicity_code(ethnicity_code) ON DELETE SET NULL
);-- better management and organization of specialties + with this we can do analysis on the db to see
-- the percentage of specielties we have etc or if we need to hire more doctors with a certain specialty
CREATE TABLE IF NOT EXISTS specialties (
    specialty_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    specialty_name VARCHAR(50) NOT NULL
);

ALTER TABLE
    doctor DROP COLUMN specialties;

ALTER TABLE
    doctor
ADD
    COLUMN specialty_id INTEGER;

ALTER TABLE
    doctor
ADD
    CONSTRAINT fk_doctor_specialty FOREIGN KEY (specialty_id) REFERENCES specialties(specialty_id);
CREATE TABLE IF NOT EXISTS receptionist (
    receptionist_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    receptionist_name VARCHAR(50) NOT NULL,
    office_id INTEGER NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    CONSTRAINT fk_receptionist_user
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS nurse (
    nurse_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER UNIQUE NOT NULL,
    nurse_name VARCHAR(50) NOT NULL,
    license_number VARCHAR(30) NOT NULL,
    specialization VARCHAR(50),
    years_of_experience INTEGER,
    CONSTRAINT fk_nurse_user
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_nurse_experience
        CHECK (years_of_experience >= 0 AND years_of_experience < 60)
);CREATE TABLE IF NOT EXISTS nurse_offices (
    nurse_id INTEGER,
    office_id INTEGER,
    PRIMARY KEY (nurse_id, office_id),
    CONSTRAINT fk_nurse_offices_nurse
        FOREIGN KEY (nurse_id) 
        REFERENCES nurse(nurse_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_nurse_offices_office
        FOREIGN KEY (office_id)
        REFERENCES office(office_id)
        ON DELETE CASCADE
);-- include receptionist and nurse into the appointments table

ALTER TABLE appointments
ADD COLUMN booked_by INTEGER,
ADD COLUMN attending_nurse INTEGER,
ADD CONSTRAINT fk_appointment_booked_by
    FOREIGN KEY (booked_by)
    REFERENCES receptionist(receptionist_id)
    ON DELETE SET NULL,
ADD CONSTRAINT fk_appointment_attending_nurse
    FOREIGN KEY (attending_nurse)
    REFERENCES nurse(nurse_id)
    ON DELETE SET NULL;-- nurses and receptionist can modify this when they set up an appointmetn
CREATE TABLE IF NOT EXISTS appointment_notes (
    note_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    appointment_id INTEGER NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by_nurse INTEGER,
    created_by_receptionist INTEGER,

    CONSTRAINT fk_appointment_notes_appointment
        FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_appointment_notes_nurse
        FOREIGN KEY (created_by_nurse)
        REFERENCES nurse(nurse_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_appointment_notes_receptionist
        FOREIGN KEY (created_by_receptionist)
        REFERENCES receptionist(receptionist_id)
        ON DELETE SET NULL,
    CONSTRAINT check_creator_type 
        CHECK (
            (created_by_nurse IS NOT NULL AND created_by_receptionist IS NULL) OR
            (created_by_nurse IS NULL AND created_by_receptionist IS NOT NULL)
        )
);

-- modify medical record to allow nurses to update/create records
ALTER TABLE medical_records
ADD COLUMN created_by INTEGER,
ADD COLUMN updated_by INTEGER,
ADD CONSTRAINT fk_medical_records_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(user_id)
    ON DELETE SET NULL,
ADD CONSTRAINT fk_medical_records_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES users(user_id)
    ON DELETE SET NULL;

-- modify billing to allow receptionists to update
ALTER TABLE billing
ADD COLUMN handled_by INTEGER,
ADD CONSTRAINT fk_billing_handled_by
    FOREIGN KEY (handled_by)
    REFERENCES users(user_id)
    ON DELETE SET NULL;-- many to many relationship between doctors and specialties
CREATE TABLE IF NOT EXISTS doctor_specialties (
    doctor_id INTEGER,
    specialty_id INTEGER,
    PRIMARY KEY (doctor_id, specialty_id),
    CONSTRAINT fk_doctor_specialties_doctor
        FOREIGN KEY (doctor_id) 
        REFERENCES doctor(doctor_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_doctor_specialties_specialty
        FOREIGN KEY (specialty_id)
        REFERENCES specialties(specialty_id)
        ON DELETE CASCADE
);CREATE TABLE IF NOT EXISTS appointment_cancellations (
    cancellation_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    appointment_id INTEGER NOT NULL,
    canceled_reason TEXT,
    canceled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cancellation_appointment
        FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE CASCADE
);CREATE TABLE IF NOT EXISTS receptionist_offices (
    receptionist_id INTEGER,
    office_id INTEGER,
    PRIMARY KEY (receptionist_id, office_id),
    CONSTRAINT fk_receptionist_offices_receptionist
        FOREIGN KEY (receptionist_id) 
        REFERENCES receptionist(receptionist_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_receptionist_offices_office
        FOREIGN KEY (office_id)
        REFERENCES office(office_id)
        ON DELETE CASCADE
);ALTER TABLE doctor_offices 
ADD COLUMN shift_start TIME,
ADD COLUMN shift_end TIME;

-- Update NURSE_OFFICES junction table
ALTER TABLE nurse_offices 
ADD COLUMN shift_start TIME,
ADD COLUMN shift_end TIME;

-- Update RECEPTIONIST_OFFICES junction table
ALTER TABLE receptionist_offices 
ADD COLUMN shift_start TIME,
ADD COLUMN shift_end TIME;ALTER TABLE doctor
DROP COLUMN specialty_id;

ALTER TABLE doctor
DROP CONSTRAINT fk_doctor_specialty;-- data structure? for faster queries but slower inserts and updates
-- run after loading some data 
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_datetime ON appointments(appointment_datetime);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);
CREATE INDEX idx_notifications_sender_id ON notifications(sender_id);
CREATE INDEX idx_notifications_receiver_id ON notifications(receiver_id);

CREATE INDEX idx_appointment_notes_appointment_id ON appointment_notes(appointment_id);
CREATE INDEX idx_appointment_notes_created_by_nurse ON appointment_notes(created_by_nurse);
CREATE INDEX idx_appointment_notes_created_by_receptionist ON appointment_notes(created_by_receptionist);-- allows the receptionist to see appointment information without revealing the patients medical record
CREATE VIEW receptionist_appointment_view AS
SELECT 
    a.appointment_id,
    a.patient_id,
    p.patient_name,
    a.doctor_id,
    d.doctor_name,
    a.office_id,
    a.appointment_datetime,
    a.duration,
    a.reason,
    a.status,
    a.booked_by,
    a.attending_nurse
FROM 
    appointments a
JOIN 
    patient p ON a.patient_id = p.patient_id
JOIN 
    doctor d ON a.doctor_id = d.doctor_id;

-- nurse view to see patient information
CREATE VIEW nurse_patient_view AS
SELECT 
    p.patient_id,
    p.patient_name,
    p.emergency_contacts,
    mr.diagnosis,
    mr.notes,
    mr.test_results
FROM 
    patient p
LEFT JOIN 
    medical_records mr ON p.patient_id = mr.patient_id;

GRANT SELECT ON nurse_patient_view TO nurse;

-- give the receptionist access to the view
GRANT SELECT ON receptionist_appointment_view TO receptionist;
GRANT SELECT, INSERT, UPDATE ON appointments TO receptionist;
GRANT SELECT, INSERT ON appointment_notes TO receptionist;

-- give receptionist view to billing
GRANT SELECT, UPDATE ON billing TO receptionist;


-- give the nurse access to the view
GRANT SELECT, INSERT, UPDATE ON appointments TO nurse;
GRANT SELECT, INSERT, UPDATE ON medical_records TO nurse;
GRANT SELECT, INSERT ON appointment_notes TO nurse;

--- give nurse and receptionist appointment notes permissions and views 
CREATE OR REPLACE VIEW nurse_appointment_notes_view AS
SELECT 
    an.note_id,
    an.appointment_id,
    an.note_text,
    an.created_at,
    n.nurse_id,
    n.nurse_name
FROM 
    appointment_notes an
JOIN 
    nurse n ON an.created_by_nurse = n.nurse_id
WHERE 
    an.created_by_nurse IS NOT NULL;

CREATE OR REPLACE VIEW receptionist_appointment_notes_view AS
SELECT 
    an.note_id,
    an.appointment_id,
    an.note_text,
    an.created_at,
    r.receptionist_id,
    r.receptionist_name
FROM 
    appointment_notes an
JOIN 
    receptionist r ON an.created_by_receptionist = r.receptionist_id
WHERE 
    an.created_by_receptionist IS NOT NULL;

-- Grant permissions for appointment notes
GRANT SELECT ON nurse_appointment_notes_view TO nurse;
GRANT SELECT ON receptionist_appointment_notes_view TO receptionist;
GRANT SELECT, INSERT, UPDATE ON appointment_notes TO nurse, receptionist;