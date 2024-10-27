--appointments linking patients, doctors, and offices
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    appointment_datetime TIMESTAMP NOT NULL,
    duration TIME NOT NULL,
    booked_by INTEGER NULL,
    attending_nurse INTEGER NULL,
    reason VARCHAR(100),
    status ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO SHOW') NOT NULL,
    -- Changed to ENUM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
