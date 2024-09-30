--appointments linking patients, doctors, and offices
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    appointment_datetime DATE NOT NULL,
    duration TIME NOT NULL,  -- Replaced INTERVAL with TIME
    reason VARCHAR(100),
    status ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO SHOW') NOT NULL,  -- Changed to ENUM
    created_at DATE default (CURRENT_DATE()) NOT null,
    updated_at DATE DEFAULT (CURRENT_DATE()) NOT NULL
--     CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) 
--         REFERENCES patient(patient_id) ON DELETE CASCADE,
--     CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id) 
--         REFERENCES doctor(doctor_id) ON DELETE CASCADE,
--     CONSTRAINT fk_appointment_office FOREIGN KEY (office_id) 
--         REFERENCES office(office_id) ON DELETE CASCADE,
--     CONSTRAINT check_appointment_datetime CHECK (appointment_datetime > created_at) -- MySQL supports CHECK starting from version 8.0.16
);