-- many to many relationship between doctors and specialties
CREATE TABLE IF NOT EXISTS doctor_specialties (
    doctor_id INT,
    specialty_id INT,
    PRIMARY KEY (doctor_id, specialty_id)-- ,
--     CONSTRAINT fk_doctor_specialties_doctor
--         FOREIGN KEY (doctor_id) 
--         REFERENCES doctor(doctor_id)
--         ON DELETE CASCADE,
--     CONSTRAINT fk_doctor_specialties_specialty
--         FOREIGN KEY (specialty_id)
--         REFERENCES specialties(specialty_id)
--         ON DELETE CASCADE
);