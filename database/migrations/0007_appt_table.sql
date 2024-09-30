--appointments linking patients, doctors, and offices
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    appointment_datetime DATETIME NOT NULL,
    duration TIME NOT NULL,
    -- Replaced INTERVAL with TIME
    booked_by INTEGER NOT NULL,
    attending_nurse INTEGER NOT NULL,
    reason VARCHAR(100),
    status ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO SHOW') NOT NULL,
    -- Changed to ENUM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
