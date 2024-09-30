-- medical records linking patients, doctors, and appointments (not required)
CREATE TABLE IF NOT EXISTS medical_records (
    record_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER,
    created_by INTEGER NULL,
    updated_by INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- dateissued
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- in case of any updates on diagnosis or changes 
    diagnosis VARCHAR(100),
    notes TEXT,
    test_results JSON
);