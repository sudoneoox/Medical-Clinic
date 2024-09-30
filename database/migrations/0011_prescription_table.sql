-- prescription information linked to a medical record
CREATE TABLE IF NOT EXISTS prescription (
    prescription_id INT PRIMARY KEY AUTO_INCREMENT,
    record_id INT NOT NULL,
    medication_name VARCHAR(50) NOT NULL,
    dosage VARCHAR(20) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    duration VARCHAR(50) NOT NULL,  -- MySQL doesn't have an INTERVAL type
    date_issued TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    pharmacy_details JSON-- ,

);