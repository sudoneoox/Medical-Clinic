-- better management and organization of specialties + with this we can do analysis on the db to see
-- the percentage of specielties we have etc or if we need to hire more doctors with a certain specialty
CREATE TABLE IF NOT EXISTS specialties (
    specialty_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    specialty_name VARCHAR(50) NOT NULL
);

ALTER TABLE
    doctor DROP COLUMN specialties;

ALTER TABLE
    doctor
ADD
    COLUMN specialty_id INTEGER;

ALTER TABLE
    doctor
ADD
    CONSTRAINT fk_doctor_specialty FOREIGN KEY (specialty_id) REFERENCES specialties(specialty_id);