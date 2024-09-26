--appointments linking patients, doctors, and offices
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER NOT NULL AUTO_INCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    office_id INTEGER NOT NULL,
    appointment_datetime DATETIME NOT NULL,
    duration TIME NOT NULL,
    reason VARCHAR(100),
    appointment_status BOOL NOT NULL,
    created_at DATE
)