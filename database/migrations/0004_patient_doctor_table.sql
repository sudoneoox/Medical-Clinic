CREATE TABLE IF NOT EXISTS patient_doctor_junction (
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    is_primary TINYINT DEFAULT 0,
    PRIMARY KEY (patient_id, doctor_id)
);

