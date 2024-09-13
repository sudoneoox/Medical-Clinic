-- medical records linking patients, doctors, and appointments (not required)
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
    CONSTRAINT fk_medical_record_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE
    SET
        NULL
);