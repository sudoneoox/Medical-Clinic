CREATE TABLE IF NOT EXISTS patient_doctor (
    patient_id INTEGER,
    doctor_id INTEGER,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (patient_id, doctor_id),
    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE,
    CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX unique_primary_doctor ON patient_doctor (patient_id) WHERE is_primary = TRUE;
