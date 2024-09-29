-- prescription information linked to a medical record
CREATE TABLE IF NOT EXISTS prescription (
    prescription_id INT PRIMARY KEY AUTO_INCREMENT,
    -- record_id INTEGER NOT NULL,     -- record_id INT NOT NULL,
    medication_info TEXT NOT NULL, -- changing next commit to account for custom type
    date_issued TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pharmacy_details JSON,

--     CONSTRAINT fk_prescription_medical_record
--         FOREIGN KEY (record_id) 
--         REFERENCES medical_records(record_id)
--         ON DELETE CASCADE
);