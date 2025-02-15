-- medical records linking patients, doctors, and appointments (not required)
CREATE TABLE IF NOT EXISTS medical_records (
    -- primary keys
    record_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- dateissued
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- in case of any updates on diagnosis or changes 
    diagnosis VARCHAR(100),
    is_deleted TINYINT DEFAULT (0),
    deleted_at TIMESTAMP NULL,
    -- foreign keys other entities
    prescription_id INTEGER NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER,
    UNIQUE(record_id)
);
