-- many to many relationship between doctors and specialties
CREATE TABLE IF NOT EXISTS doctor_specialties (
    doctor_id INTEGER NOT NULL,
    specialty_code TINYINT NOT NULL,
    PRIMARY KEY (doctor_id, specialty_code)
);