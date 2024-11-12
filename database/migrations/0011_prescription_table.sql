-- prescription information linked to a medical record
CREATE TABLE IF NOT EXISTS prescription (
    prescription_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    medical_record_id INTEGER NOT NULL,
    medication_name VARCHAR(50) NOT NULL,
    dosage VARCHAR(20) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    duration VARCHAR(50) NOT NULL,  -- MySQL doesn't have an INTERVAL type
    date_issued TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pharmacy_details JSON,
    is_deleted TINYINT DEFAULT 0,
    UNIQUE(prescription_id)
);
