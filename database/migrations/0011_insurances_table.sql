-- patient insurance information linked with patient id to identify
CREATE TABLE IF NOT EXISTS insurances (
    insurance_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    patient_id INTEGER NOT NULL,
    insurance_info insurance NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);