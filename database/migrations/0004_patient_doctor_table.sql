CREATE TABLE IF NOT EXISTS patient_doctor_junction (
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    is_primary TINYINT DEFAULT 0,
    PRIMARY KEY (patient_id, doctor_id)

    -- CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE,
    -- CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE
);

-- CREATE UNIQUE INDEX unique_primary_doctor ON patient_doctor (patient_id) WHERE is_primary = TRUE;
