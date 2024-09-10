-- office locations
CREATE TABLE IF NOT EXISTS office  (
    office_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    address address NOT NULL,
    phone phone_num,
    email TEXT,
    services VARCHAR(50) []
);

-- Doctor-Office Relationship (many to many)
CREATE TABLE IF NOT EXISTS doctor_offices (
    doctor_id INTEGER,
    office_id INTEGER,
    PRIMARY KEY (doctor_id, office_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
    FOREIGN KEY (office_id) REFERENCES office(office_id)
);