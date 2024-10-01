-- strict mode 
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- foreign key checks = true
SET FOREIGN_KEY_CHECKS = 1;


-- base table for authentication and logging in 
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_username VARCHAR(50) UNIQUE NOT NULL,
    -- long passwd in case we want to hash? 
    user_password VARCHAR(200) NOT NULL,
    user_email VARCHAR(50) UNIQUE NOT NULL,
    user_phone VARCHAR(20) UNIQUE NOT NULL,
    account_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_role ENUM(
        "Admin",
        "Patient",
        "Doctor",
        "Receptionist",
        "Nurse"
    ) NOT NULL,
    demographics_id INTEGER NOT NULL
);-- Doctor table, extends user
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INTEGER NOT NULL AUTO_INCREMENT,
    doctor_employee_id VARCHAR(30) NOT NULL,
    user_id INTEGER UNIQUE NOT NULL,
    doctor_name VARCHAR(50) NOT NULL,
    years_of_experience TINYINT NOT NULL,
    PRIMARY KEY(doctor_id, doctor_employee_id)
    -- CONSTRAINT chk_years_experience CHECK (years_of_experience > 0 AND years_of_experience < 90)
);-- holds a ptr to the user_id to distinguish between patients and doctors
-- we could maybe do a boolcase ? ie ids larger than 1000 are doctors ? 
-- patient table, extends user
CREATE TABLE IF NOT EXISTS patients (
    patient_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    patient_name VARCHAR(50) NOT NULL,
    emergency_contacts JSON 
);CREATE TABLE IF NOT EXISTS patient_doctor_junction (
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    is_primary TINYINT DEFAULT 0,
    PRIMARY KEY (patient_id, doctor_id)
);

-- specialist approval requests
CREATE TABLE IF NOT EXISTS specialist_approvals (
    approval_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    specialist_status ENUM('APPROVED', 'PENDING', 'REJECTED') DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    patient_id INTEGER NOT NULL,
    requesting_doctor_id INTEGER NOT NULL,
    specialist_id INTEGER NOT NULL
);--office locatios
CREATE TABLE IF NOT EXISTS office (
    office_id INT NOT NULL auto_increment primary key,
    office_name VARCHAR(50) NOT NULL,
    office_address VARCHAR(50) NOT NULL,
    office_phone VARCHAR(20),
    office_email VARCHAR(50),
    office_services JSON
);

-- Doctor-Office Relationship
CREATE TABLE IF NOT EXISTS doctor_offices (
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    PRIMARY KEY (doctor_id, office_id)
);--appointments linking patients, doctors, and offices
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    appointment_datetime TIMESTAMP NOT NULL,
    duration TIME NOT NULL,
    booked_by INTEGER NULL,
    attending_nurse INTEGER NULL,
    reason VARCHAR(100),
    status ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO SHOW') NOT NULL,
    -- Changed to ENUM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);-- Billing table to keep track of payments for appointments
CREATE TABLE IF NOT EXISTS billing (
    billing_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    appointment_id INTEGER NOT NULL,
    amount_due DECIMAL(7, 2) NOT NULL,
    amount_paid DECIMAL(7, 2) NOT NULL DEFAULT 0,
    payment_status ENUM(
        'PAID',
        'NOT PAID',
        'IN PROGRESS',
        'CANCELLED',
        'REFUNDED'
    ) NOT NULL,
    billing_due TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    handled_by INTEGER
);-- patient insurance information linked with patient id to identify
CREATE TABLE IF NOT EXISTS insurances (
    insurance_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    insurance_info JSON,
    is_active TINYINT DEFAULT (1)
);-- medical records linking patients, doctors, and appointments (not required)
CREATE TABLE IF NOT EXISTS medical_records (
    -- primary keys
    record_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- dateissued
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- in case of any updates on diagnosis or changes 
    diagnosis VARCHAR(100),
    notes TEXT,
    -- foreign keys other entities
    prescription_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER
    
);-- prescription information linked to a medical record
CREATE TABLE IF NOT EXISTS prescription (
    prescription_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    medical_record_id INTEGER NOT NULL,
    medication_name VARCHAR(50) NOT NULL,
    dosage VARCHAR(20) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    duration VARCHAR(50) NOT NULL,  -- MySQL doesn't have an INTERVAL type
    date_issued TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pharmacy_details JSON
);CREATE TABLE IF NOT EXISTS race_code (
    race_code TINYINT NOT NULL PRIMARY KEY,
    race_text VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS gender_code (
    gender_code TINYINT NOT NULL PRIMARY KEY,
    gender_text VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS ethnicity_code (
    ethnicity_code TINYINT NOT NULL PRIMARY KEY,
    ethnicity_text VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS demographics (
    demographics_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ethnicity_id TINYINT NULL,
    race_id TINYINT NULL,
    gender_id TINYINT NULL,
    dob DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_at DATE
);CREATE TABLE IF NOT EXISTS specialties_code (
    specialty_code INTEGER NOT NULL PRIMARY KEY,
    specialty_name VARCHAR(30) NOT NULL
);CREATE TABLE IF NOT EXISTS receptionists (
    receptionist_id INTEGER NOT NULL AUTO_INCREMENT,
    receptionist_employee_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL, -- fk
    receptionist_name VARCHAR(50) NOT NULL,
    PRIMARY KEY(receptionist_id, receptionist_employee_id)
);CREATE TABLE IF NOT EXISTS nurses (
    nurse_id INTEGER NOT NULL AUTO_INCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    nurse_name VARCHAR(50) NOT NULL,
    nurse_employee_id INTEGER NOT NULL,
    specialization VARCHAR(50),
    years_of_experience TINYINT,
    PRIMARY KEY (nurse_id, nurse_employee_id)
);CREATE TABLE IF NOT EXISTS nurse_offices (
    nurse_id INT NOT NULL,
    office_id INT NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    PRIMARY KEY (nurse_id, office_id)
);-- nurses and receptionist can modify this when they set up an appointmetn
CREATE TABLE IF NOT EXISTS appointment_notes (
    note_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_nurse INTEGER,
    created_by_receptionist INTEGER
    -- THIS IS AN IMPORTANNT CONSTRAINT NEED TO FIND A WAY 
    -- TO DO IT IN MY SQL
    -- CONSTRAINT check_creator_type  -- not supported need trigger
    --     CHECK (
    --         (created_by_nurse IS NOT NULL AND created_by_receptionist IS NULL) OR
    --         (created_by_nurse IS NULL AND created_by_receptionist IS NOT NULL)
    --     )
);-- many to many relationship between doctors and specialties
CREATE TABLE IF NOT EXISTS doctor_specialties (
    doctor_id INTEGER NOT NULL,
    specialtity_code INTEGER NOT NULL,
    PRIMARY KEY (doctor_id, specialtity_code)
);CREATE TABLE IF NOT EXISTS appointment_cancellations (
    cancellation_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    canceled_reason TEXT,
    canceled_at DATETIME DEFAULT CURRENT_TIMESTAMP
);CREATE TABLE IF NOT EXISTS receptionist_offices (
    receptionist_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    shift_start TIME,
    shift_end TIME,
    PRIMARY KEY (receptionist_id, office_id)
);CREATE TABLE IF NOT EXISTS test_results (
    -- primary keys
    test_results_id INTEGER NOT NULL PRIMARY KEY,
    test_type ENUM('BLOOD', 'XRAY', 'URINE'),
    test_name VARCHAR(30),
    test_conducted_date DATE,
    test_result JSON,
    test_units VARCHAR(10),
    test_interpretation ENUM("BELOW", "NORMAL", "ABOVE"),
    test_status ENUM("PENDING", "COMPLETED"),
    -- foreign keys
    test_performed_by INTEGER NOT NULL,
    medical_record_id INTEGER NOT NULL
);-- do constraints here with delimeters

-- in appointment notes table
 -- THIS IS AN IMPORTANT CONSTRAINT NEED TO FIND A WAY 
    -- TO DO IT IN MYSQL
    -- CONSTRAINT check_creator_type  -- not supported need trigger
    --     CHECK (
    --         (created_by_nurse IS NOT NULL AND created_by_receptionist IS NULL) OR
    --         (created_by_nurse IS NULL AND created_by_receptionist IS NOT NULL)
    --     )

-- billing table constraints
 --   CONSTRAINT check_amount_due CHECK (amount_due >= 0),
 --   CONSTRAINT check_amount_paid CHECK (amount_paid >= 0),-- user table relations I dont think it has any but id have to check?
ALTER TABLE users
ADD CONSTRAINT fk_user_demographics_id
    FOREIGN KEY (demographics_id)
    REFERENCES demographics(demographics_id)
    ON DELETE CASCADE;

-- Doctor table relations
ALTER TABLE doctors
ADD CONSTRAINT fk_doctor_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;

-- Patient table relations
ALTER TABLE patients
ADD CONSTRAINT fk_patient_user
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;

-- Patient_Doctor junction table relations
ALTER TABLE patient_doctor_junction
ADD CONSTRAINT fk_patient_doctor_patient
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_patient_doctor_doctor
    FOREIGN KEY (doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE;

-- Specialist approvals table relations
ALTER TABLE specialist_approvals
ADD CONSTRAINT fk_approval_patient
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_approval_requesting_doctor
    FOREIGN KEY (requesting_doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_approval_specialist
    FOREIGN KEY (specialist_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE;

-- Appointments table relations
ALTER TABLE appointments
ADD CONSTRAINT fk_appointment_patient 
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_appointment_doctor 
    FOREIGN KEY (doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_appointment_booked_by
    FOREIGN KEY (booked_by)
    REFERENCES receptionists(receptionist_id)
    ON DELETE SET NULL,
ADD CONSTRAINT fk_appointment_attending_nurse
    FOREIGN KEY (attending_nurse)
    REFERENCES nurses(nurse_id)
    ON DELETE SET NULL;

-- Billing table relations
ALTER TABLE billing
ADD CONSTRAINT fk_billing_patient 
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_billing_appointment 
    FOREIGN KEY (appointment_id) 
    REFERENCES appointments(appointment_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_billing_handled_by
    FOREIGN KEY (handled_by)
    REFERENCES receptionists(receptionist_id)
    ON DELETE SET NULL;

-- Insurances table relations
ALTER TABLE insurances
ADD CONSTRAINT fk_insurance_patient
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE;

-- Medical records table relations
ALTER TABLE medical_records
ADD CONSTRAINT fk_medical_record_patient 
    FOREIGN KEY (patient_id) 
    REFERENCES patients(patient_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_medical_record_doctor 
    FOREIGN KEY (doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_medical_record_appointment 
    FOREIGN KEY (appointment_id) 
    REFERENCES appointments(appointment_id)
    ON DELETE SET NULL;

-- prescription table relations
ALTER TABLE prescription
ADD CONSTRAINT fk_prescription_medical_record_id
    FOREIGN KEY (medical_record_id)
    REFERENCES medical_records(record_id)
    ON DELETE CASCADE;

-- test results table relations
ALTER TABLE test_results
ADD CONSTRAINT fk_test_results_medical_record_id
    FOREIGN KEY (medical_record_id)
    REFERENCES medical_records(record_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_test_results_performed_by_id
    FOREIGN KEY (test_performed_by)
    REFERENCES nurses(nurse_id)
    ON DELETE CASCADE;

-- Demographics table relations
ALTER TABLE demographics
ADD CONSTRAINT fk_demographics_race_code 
    FOREIGN KEY (race_id) 
    REFERENCES race_code(race_code)
    ON DELETE SET NULL, 
ADD CONSTRAINT fk_demographics_gender_code 
    FOREIGN KEY (gender_id) 
    REFERENCES gender_code(gender_code)
    ON DELETE SET NULL,
ADD CONSTRAINT fk_demographics_ethnicity_code 
    FOREIGN KEY (ethnicity_id) 
    REFERENCES ethnicity_code(ethnicity_code)
    ON DELETE SET NULL;

-- Receptionist table relations
ALTER TABLE receptionists
ADD CONSTRAINT fk_receptionist_user
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;

-- Nurse table relations
ALTER TABLE nurses
ADD CONSTRAINT fk_nurse_user
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE;

-- Doctor-office junction table relations
ALTER TABLE doctor_offices
ADD CONSTRAINT fk_doctor_offices_doctor
    FOREIGN KEY (doctor_id)
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_doctor_offices_office
    FOREIGN KEY (office_id)
    REFERENCES office(office_id)
    ON DELETE CASCADE;



-- Nurse-Office junction table relations
ALTER TABLE nurse_offices
ADD CONSTRAINT fk_nurse_offices_nurse
    FOREIGN KEY (nurse_id) 
    REFERENCES nurses(nurse_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_nurse_offices_office
    FOREIGN KEY (office_id)
    REFERENCES office(office_id)
    ON DELETE CASCADE;

-- Appointment_notes table relations
ALTER TABLE appointment_notes
ADD CONSTRAINT fk_appointment_notes_appointment
    FOREIGN KEY (appointment_id)
    REFERENCES appointments(appointment_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_appointment_notes_nurse
    FOREIGN KEY (created_by_nurse)
    REFERENCES nurses(nurse_id)
    ON DELETE SET NULL,
ADD CONSTRAINT fk_appointment_notes_receptionist
    FOREIGN KEY (created_by_receptionist)
    REFERENCES receptionists(receptionist_id)
    ON DELETE SET NULL;

-- Doctor-Specialties junction table relations
ALTER TABLE doctor_specialties
ADD CONSTRAINT fk_doctor_specialties_doctor
    FOREIGN KEY (doctor_id) 
    REFERENCES doctors(doctor_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_doctor_specialties_specialty
    FOREIGN KEY (specialtity_code)
    REFERENCES specialties_code(specialty_code)
    ON DELETE CASCADE;

-- Appointment cancellations table relations
ALTER TABLE appointment_cancellations
ADD CONSTRAINT fk_cancellation_appointment
    FOREIGN KEY (appointment_id)
    REFERENCES appointments(appointment_id)
    ON DELETE CASCADE;

-- Receptionist_Office junction table relations
ALTER TABLE receptionist_offices
ADD CONSTRAINT fk_receptionist_offices_receptionist
    FOREIGN KEY (receptionist_id) 
    REFERENCES receptionists(receptionist_id)
    ON DELETE CASCADE,
ADD CONSTRAINT fk_receptionist_offices_office
    FOREIGN KEY (office_id)
    REFERENCES office(office_id)
    ON DELETE CASCADE;
-- do complex views here for nurses and receptionists
