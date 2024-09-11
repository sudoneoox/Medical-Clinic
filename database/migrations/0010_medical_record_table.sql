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
    CONSTRAINT fk_medical_record_patient
        FOREIGN KEY (patient_id) 
        REFERENCES patient(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_medical_record_doctor
        FOREIGN KEY (doctor_id) 
        REFERENCES doctor(doctor_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_medical_record_appointment
        FOREIGN KEY (appointment_id) 
        REFERENCES appointments(appointment_id)
        ON DELETE SET NULL
);