CREATE TABLE IF NOT EXISTS patient_specialized_doctors (
    patient_id INTEGER,
    doctor_id INTEGER,
    PRIMARY KEY (patient_id, doctor_id),
    CONSTRAINT fk_speacialized_patient
        FOREIGN KEY (patient_id)
        REFERENCES patient(patient_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_specialized_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctor(doctor_id)
        ON DELETE CASCADE
);
