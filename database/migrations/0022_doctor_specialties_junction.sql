-- many to many relationship between doctors and specialties
CREATE TABLE IF NOT EXISTS doctor_specialties (
    doctor_id INT,
    specialty_id INT,
    PRIMARY KEY (doctor_id, specialty_id)
);