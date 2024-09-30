-- patient insurance information linked with patient id to identify
CREATE TABLE IF NOT EXISTS insurances (
    insurance_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    insurance_info JSON,
    is_active TINYINT DEFAULT (1)
);