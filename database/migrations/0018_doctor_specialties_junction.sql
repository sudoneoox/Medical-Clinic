-- many to many relationship between doctors and specialties
CREATE TABLE IF NOT EXISTS doctor_specialties (
    doctor_id INTEGER NOT NULL,
    specialtity_code INTEGER NOT NULL,
    PRIMARY KEY (doctor_id, specialtity_code)
);