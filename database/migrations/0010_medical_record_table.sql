-- medical records linking patients, doctors, and appointments (not required)
CREATE TABLE IF NOT EXISTS medical_records (
    record_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_id INTEGER,
    created_by INTEGER NOT NULL,
    updated_by INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- dateissued
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- in case of any updates on diagnosis or changes 
    diagnosis VARCHAR(100),
    notes TEXT,
    test_results JSON
);